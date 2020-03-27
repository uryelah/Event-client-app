const capitalize = (name) => {
  const capitalized = name[0].toUpperCase() + name.substring(1);

  return capitalized;
};

const loggedUser = (() => {
  let user = null;
  const login = (obj) => {
    user = obj;
  };

  const logged = () => user;

  return {
    logged,
    login,
  };
})();

const Db = (() => ({
  users: {
    nextId: 0,
  },
  events: {
    nextId: 0,
  },
  userEvent: {
    nextId: 0,
  },
}))();

const User = (userObj) => {
  const { firstName, lastName } = userObj;
  const { premium, email } = userObj;
  const events = [];
  const id = Db.users.nextId;

  const newUser = {
    id,
    firstName: capitalize(firstName),
    lastName: capitalize(lastName),
    premium,
    email,
    events,
  };

  Db.users[id] = newUser;
  Db.users.nextId += 1;

  return newUser;
};

// MeetUp, Leap, Recruiting, Mission, VanHackathon, Premium-only Webnar, Open Webnar
const Event = (eventObj) => {
  const {
    type, title, description, location, date, deadLine, premium, country,
  } = eventObj;

  const attendants = [];
  const shareCount = 0;
  const id = Db.events.nextId;

  const newEvent = {
    id,
    type,
    title,
    premium,
    description,
    location,
    country,
    date,
    deadLine,
    attendants,
    shareCount,
  };

  Db.events[id] = newEvent;
  Db.events.nextId += 1;

  return newEvent;
};

const UserEvent = (joinObj) => {
  const { userId, eventId } = joinObj;
  if (Db.events[eventId].premium) {
    if (!Db.users[userId].premium) {
      return 'NOT_PREMIUM_ERROR';
    }
  }

  for (const key in Db.userEvent) {
    if (key !== 'nextId') {
      if (Db.userEvent[key].userId === userId && Db.userEvent[key].eventId === eventId) {
        return 'ALREADY_APPLYED_ERROR';
      }
    }
  }

  const id = Db.userEvent.nextId;

  const newJoin = { id, userId, eventId };

  Db.userEvent[id] = newJoin;
  Db.userEvent.nextId += 1;

  return newJoin;
};

const charly = User({
  firstName: 'Charly', lastName: 'Adamns', premium: false, email: 'charchar@mail.com',
});
const winona = User({
  firstName: 'Winona', lastName: 'Rider', premium: true, email: 'charchar@mail.com',
});

const recruitment = Event({
  type: 'Leap', premium: false, title: 'Leap into', description: '...', country: 'CA', location: 'Sao Paulo', date: new Date(Date.UTC(2020, 1, 10, 15, 0, 0, 0)), deadLine: 'Mon 1 2020',
});
const recruitment1 = Event({
  type: 'past Leap', premium: false, title: 'Leap intoa', description: '...', country: 'CA', location: 'Sao Paulo', date: new Date(Date.UTC(2020, 2, 10, 15, 0, 0, 0)), deadLine: 'Mon 1 2020',
});

const mission = Event({
  type: 'Mission', premium: true, title: 'Latin America', description: '...', country: 'CA', location: 'Sao Paulo', date: new Date(Date.UTC(2020, 3, 21, 11, 0, 0, 0)), deadLine: 'Mon 1 2020',
});
const recruitment2 = Event({
  type: 'Future Leap', premium: false, title: 'Leap into Canada', description: '...', country: 'CA', location: 'Sao Paulo', date: new Date(Date.UTC(2020, 5, 10, 15, 0, 0, 0)), deadLine: 'Mon 1 2020',
});

const closeModal = (cover, modal) => {
  document.getElementById(cover).classList.add('hidden');
  document.getElementById(modal).classList.add('hidden');
};

const attendingDetails = (key) => {
  const {
    title, premium, date, location, description,
  } = Db.events[key];
  const modal = document.getElementById('event-modal');

  modal.querySelector('.modal-content').innerHTML = `
  <h2>${title}</h2>
  <em>${premium ? '(Premium)' : ''}</em>
  <br/>
  <small>${date.toDateString()}</small>
  <br/>
  <small>${location}</small>
  <p>${description}</p>
  <br/>
  <a class="twitter-share-button"
  href="https://twitter.com/intent/tweet?text=Im%20going%20to%20the%20VanHack%20event%20at%20link"
  data-size="large">
Share on Twitter</a>
  `;

  modal.classList.remove('hidden');
  document.getElementById('doc-cover').classList.remove('hidden');
};

const tempMessage = (element, message, type = 'warn') => {
  element.innerHTML = message;
  element.classList = `alert-${type}`;
  element.classList.remove('leave');
  element.classList.add('show');

  setTimeout(() => {
    element.classList.add('leave');
    element.classList.remove('show');
  }, 5000);
};

// / DOM STUFF
window.onload = () => {
  const userSelect = document.getElementById('user-select');
  const userGreet = document.getElementById('current-user-greet');
  const eventContainer = document.getElementById('events');
  const applyedEvents = document.getElementById('my-events');
  const alertContainer = document.getElementById('alert');
  const pastEventContainer = document.getElementById('past-events');

  for (const key in Db.users) {
    const { id, firstName, premium } = Db.users[key];
    if (key !== 'nextId') {
      userSelect.innerHTML += `<option class='user' data-user=${id}>${firstName}(${premium ? 'premium' : 'regular'})</option>`;
    }
  }

  const populateEvents = (user) => {
    const events2Show = {
      main: [],
      past: [],
    };

    for (const key in Db.events) {
      if (key !== 'nextId') {
        if (user && user.events.includes(key)) {
          events2Show.main.push({ ...Db.events[key], container: applyedEvents });
        } else if (Db.events[key].date.getTime() >= Date.now()) {
          events2Show.main.push({ ...Db.events[key], container: eventContainer });
        } else {
          events2Show.past.push({ ...Db.events[key], container: pastEventContainer });
        }
      }
    }
    return events2Show;
  };

  const eventComponent = (event, past = false) => {
    const {
      type, premium, id, title, date, location, deadLine, country,
    } = event;
    // MeetUp, Leap, Recruiting, Mission, VanHackathon, Premium-only Webnar, Open Webnar
    return (
      `<article class='event ${past && 'card-micro'} card ${type}-event ${premium ? 'premium-event' : ''}' onclick='attendingDetails(${id})' data-event='${id}' id='${id}'>
      <header>
        <h2 class='title'>${title}</h2>
        <figure class='flag-64'>
          <img alt='${country} flag' src='https://www.countryflags.io/${country.toLowerCase()}/flat/64.png'>
        </figure>
      </header>
      <div class='card-cover ${type.toLowerCase()}-cover'>
      </div>
      <div class='card-info'>
        <time class='event-date' datetime='${date}'>${date.toDateString()}</time>
        <span><i class="fas fa-map-marker-alt"></i>${location}</span>
        ${!past ? `<span><i class="far fa-calendar-alt"></i> Deadline: <time datetime='${deadLine}'>${deadLine}</time></span>
        <div class='button-row'>
          <button class='apply-btn button-default' data-event='${id}' type='button'>APPLY</button>
          <a class="twitter-share-button"
          href="https://twitter.com/intent/tweet?text=Check%20out%20this%20VanHack%20event%20at%20link"
          data-size="large">
          <i class="fas fa-share-alt"></i></a>
        </div>
      </div>`
        : '</div> <a class="more" href="#"><i class="fas fa-ellipsis-v"></i></a>'}
      </article>`
    );
  };

  const addEvent2Btns = () => {
    Array.from(document.getElementsByClassName('apply-btn')).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const event = Db.events[btn.dataset.event];
        const { logged } = loggedUser;
        const curUser = logged();
        if (!loggedUser.logged()) {
          tempMessage(alertContainer, 'Login first to apply');
        } else {
          const newAttending = UserEvent({ userId: curUser.id, eventId: btn.dataset.event });
          if (newAttending === 'NOT_PREMIUM_ERROR') {
            tempMessage(alertContainer, '<p>Sorry, this even is for premium users only. <a href="#">Learn more about premium memberships</a></p>');
          } else if (newAttending !== 'ALREADY_APPLYED_ERROR') {
            logged().events.push(btn.dataset.event);
            document.getElementById(`${btn.dataset.event}`).remove();
            applyedEvents.innerHTML += eventComponent(event, true);
            tempMessage(alertContainer, `<p>You are now taking part at ${event.title}</p>`, 'success');
          }
        }
        e.stopPropagation();
      });
    });
  };

  const sortEvents = (events, direction) => events.sort((a, b) => {
    if (a.date.getTime() < b.date.getTime()) {
      return -1 * direction;
    } if (a.date.getTime() > b.date.getTime()) {
      return 1 * direction;
    }
    return 0;
  });

  const addEvents2Dom = ({ main, past }) => {
    const eventContainer = document.getElementById('events');
    const pastEventContainer = document.getElementById('past-events');
    applyedEvents.innerHTML = '';
    eventContainer.innerHTML = '';
    pastEventContainer.innerHTML = '';

    past.forEach((event) => {
      pastEventContainer.innerHTML += eventComponent(event, true);
    });

    main.forEach((event) => {
      event.container.innerHTML += eventComponent(event);
    });
  };

  const events = populateEvents(loggedUser.logged());
  const sortedEvents = {
    main: sortEvents(events.main, 1),
    past: sortEvents(events.past, -1),
  };
  addEvents2Dom(sortedEvents);

  addEvent2Btns();

  const checkLoggedUser = () => {
    if (loggedUser.logged()) {
      userGreet.innerHTML = `Welcome, ${loggedUser.logged().firstName}`;
      const currentEvents = populateEvents(loggedUser.logged());
      const sortedEvents = {
        main: sortEvents(currentEvents.main, 1),
        past: sortEvents(currentEvents.past, -1),
      };
      addEvents2Dom(sortedEvents);
      addEvent2Btns();
    } else {
      userGreet.innerHTML = 'Login to use this app.';
      applyedEvents.innerHTML = '';
    }
  };

  checkLoggedUser();

  Array.from(userSelect.querySelectorAll('.user')).forEach((user) => {
    user.addEventListener('click', () => {
      const clickedUser = Db.users[user.dataset.user];
      loggedUser.login(clickedUser);
      checkLoggedUser();
    });
  });

  addEvent2Btns();
};
