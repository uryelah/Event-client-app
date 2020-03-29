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
  const { firstName, lastName, picture } = userObj;
  const { premium, email } = userObj;
  const events = [];
  const id = Db.users.nextId;

  const newUser = {
    id,
    firstName: capitalize(firstName),
    lastName: capitalize(lastName),
    picture,
    premium,
    email,
    events,
    CTAcount: 0,
  };

  Db.users[id] = newUser;
  Db.users.nextId += 1;

  return newUser;
};

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
  firstName: 'Charly', lastName: 'Adamns', premium: false, picture: 'https://www.shuttertalk.com/wp-content/uploads/2019/02/Photography-with-glasses.jpg', email: 'charchar@mail.com',
});
const winona = User({
  firstName: 'Winona', lastName: 'Rider', premium: true, picture: 'https://img-static.tradesy.com/item/24264036/ray-ban-multi-frame-and-demo-lens-women-rectangular-eyeglasses-1-1-960-960.jpg', email: 'charchar@mail.com',
});

const description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum quos inventore cum quia obcaecati dolore esse ratione dicta architecto hic provident, nam, impedit eum nisi quisquam veniam. Quibusdam, consequatur distinctio!';

const recruitment = Event({
  type: 'Leap', premium: false, title: 'Leap into', description, country: 'UK', location: 'Sao Paulo', date: new Date(Date.UTC(2020, 1, 10, 15, 0, 0, 0)), deadLine: 'Mon 1 2020',
});
const recruitment1 = Event({
  type: 'Mission', premium: false, title: 'Leap into', description, country: 'CA', location: 'Sao Paulo', date: new Date(Date.UTC(2020, 2, 10, 15, 0, 0, 0)), deadLine: 'Mon 1 2020',
});

Event({
  type: 'Recruiting', premium: false, title: 'Leap into', description, country: 'CA', location: 'Sao Paulo', date: new Date(Date.UTC(2020, 4, 10, 15, 0, 0, 0)), deadLine: 'Mon 1 2020',
});

Event({
  type: 'Meetup', premium: false, title: 'Leap into', description, country: 'CA', location: 'Sao Paulo', date: new Date(Date.UTC(2020, 5, 10, 15, 0, 0, 0)), deadLine: 'Mon 1 2020',
});

Event({
  type: 'Webinar', premium: false, title: 'Leap into', description, country: 'CA', location: 'Sao Paulo', date: new Date(Date.UTC(2020, 8, 10, 15, 0, 0, 0)), deadLine: 'Mon 1 2020',
});


const mission = Event({
  type: 'Webinar', premium: true, title: 'Latin America', description, country: 'US', location: 'Sao Paulo', date: new Date(Date.UTC(2020, 3, 21, 11, 0, 0, 0)), deadLine: 'Mon 1 2020',
});
const recruitment2 = Event({
  type: 'Vanhackathon', premium: false, title: 'Leap into Canada', description, country: 'CA', location: 'Sao Paulo', date: new Date(Date.UTC(2020, 5, 10, 15, 0, 0, 0)), deadLine: 'Mon 1 2020',
});

const tweetEvent = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const closeModal = (cover, modal) => {
  const modal2Close = document.getElementById(modal);
  modal2Close.classList.add('hidden');
  modal2Close.style.top = '-800px';
  modal2Close.classList.remove('modal-message');
  document.getElementById(cover).classList.add('hidden');
};

const eventComponent = (event, past = false, attending = false, thumbnail = false) => {
  const {
    type, premium, id, title, date, location, deadLine, country,
  } = event;

  const onClick = thumbnail ? `featureEvent(${id})` : `attendingDetails(${id})`;
  const tweet = `I'm going to Vanhack ${title} ${type}. Come with me, check it out at https://vanhack.com/platform/#/events`
  const linkedin = `${id}_${title}`;

  const socialLinks = `<div class="tooltip tooltip-row">
    <a class="twitter-share-button" target="_blank" 
    href="https://twitter.com/intent/tweet?text=${tweet}"
    data-size="large">
      <i class="fab fa-twitter"></i></a>
    </a>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://vanhack.com/${linkedin}" target="_blank" title="Share on LinkedIn">
      <i class="fab fa-linkedin"></i>
    </a>
    </div>`;

  return (
    `<article class='event ${past && !attending ? 'card-micro' : ''} ${attending ? 'card-macro' : ''} card ${type}-event ${premium ? 'premium-event' : ''}' onclick=${onClick} data-event='${id}' id='${id}'>
    <header>
      <h2 class='title'>${title}</h2>
      <figure class='flag-64'>
        <img alt='${country} flag' src='https://www.countryflags.io/${country.toLowerCase()}/flat/64.png'>
      </figure>
    </header>
    <div class='card-cover ${type.toLowerCase()}-cover'>
    ${premium
      ? `<div class='premium-row'>
      <i class='fa fa-star premium-star'></i>
      <i class='fa fa-star premium-star-back'></i>
      <span>Premium-only</span>
    </div>`
      : (['leap', 'mission', 'vanhackathon'].includes(type.toLowerCase()) ? `<div class='event-type'>
        <div class='event-flag'>
          ${type.toLowerCase() === 'leap' ? `<i class="fas fa-rainbow"></i>` : ''}

          ${type.toLowerCase() === 'mission' ? `<i class="fas fa-users"></i>` : ''}

          ${type.toLowerCase() === 'vanhackathon' ? `<i class="fas fa-laptop-code"></i>` : ''}
        </div>
        <span class='event-name'>${type}</span>
      </div>` : '')}
    </div>
    <div class='card-info'>
      <p class='info-top'><time class='event-date' datetime='${date}'>${date.toDateString()}</time> <span>${type}</span></p>
      <span><i class="fas fa-map-marker-alt"></i>${location}</span>
      ${!past ? `<span><i class="far fa-calendar-alt"></i> Deadline: <time datetime='${deadLine}'>${deadLine}</time></span>
      <div class='button-row'>
        ${attending ? `<button class='aplication-btn button-default' data-event='${id}' type='button'>See Application</button>`
      : `<button class='apply-btn button-default' data-event='${id}' type='button'>APPLY</button>` }
        <div class="tooltip-owner tooltip-media">
          <i class="fas fa-share-alt"></i>
          ${socialLinks}
        </div>
      </div>
    </div>`
      : '</div> <a class="more" href="#"><i class="fas fa-ellipsis-v"></i></a>'}
    </article>`
  );
};

const attendingDetails = (key) => {
  const {
    id, country, type, title, premium, date, location, description, container, deadLine,
  } = Db.events[key];
  const modal = document.getElementById('event-modal');

  const tweet = `I'm going to Vanhack ${title} ${type}. Come with me, check it out at https://vanhack.com/platform/#/events`
  const linkedin = `${id}_${title}`;

  modal.querySelector('.modal-content').innerHTML = `
  <h2>${title}</h2>
  <div class='event-detail'>
    ${premium ? '<p class="premium-flag">Premium-only</p>' : ''}
    <p><strong>Event type: </strong> <span>${type}</span></p>
    <p><strong>Country: </strong> <span>${country}</span></p>
  </div>
  <div class='event-description'>
    <p>${description}</p>
    <p><strong>Location: </strong> <span>${location}</span></p>
    <p><strong>Date: </strong> <span>${date.toDateString()}</span></p>
    ${Db.events[key].date.getTime() >= Date.now() ? `
    <p><strong>Application deadline: </strong> ${deadLine}</p>
    ` : ''}
  </div>
  <div class='social-media'>
    <a class="twitter-share-button" target="_blank" 
    href="https://twitter.com/intent/tweet?text=${tweet}"
    data-size="large">
    <i class="fab fa-twitter"></i></a>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://vanhack.com/${linkedin}" target="_blank" title="Share on LinkedIn">
      <i class="fab fa-linkedin"></i>
    </a>
  </div>
  `;

  modal.classList.remove('hidden');
  document.getElementById('doc-cover').classList.remove('hidden');
  setTimeout(() => {
    modal.style.top = '100px';
    modal.style.left = `${(document.body.clientWidth / 2) - (modal.clientWidth / 2)}px`;
  }, 300);
};

const openPremiumModal = () => {
  const modal = document.getElementById('event-modal');

  modal.querySelector('.modal-content').innerHTML = `
  <article class='premium-modal'>
    <header class='premium-image'>
      <h2>
        <svg class="ico-svg" aria-hidden="true" focusable="false" data-prefix="far" data-icon="lock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-lock fa-w-14 fa-2x"><path fill="currentColor" d="M400 192h-32v-46.6C368 65.8 304 .2 224.4 0 144.8-.2 80 64.5 80 144v48H48c-26.5 0-48 21.5-48 48v224c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V240c0-26.5-21.5-48-48-48zm-272-48c0-52.9 43.1-96 96-96s96 43.1 96 96v48H128v-48zm272 320H48V240h352v224z" class=""></path></svg>
        This is a premium exclusive event
      </h2>
      <button class="button-default button-premium"><i class="fa fa-star"></i>Gain access</button>
    </header>
    <div class='premium-description'>
      <h3>Vanhack premium acount</h3>
      <p>
        One of many perks of having being a premium Vanhack user is the access to premium webinars that give you insider access to the best international companies recruiting proccesses.
      </p>
      <p><a href='#'>Find out more.</a></p>
    </div>
  </article>
  `;

  modal.classList.add('modal-message');
  modal.classList.remove('hidden');
  document.getElementById('doc-cover').classList.remove('hidden');

  setTimeout(() => {
    modal.style.top = '100px';
    modal.style.left = `${(document.body.clientWidth / 2) - (modal.clientWidth / 2)}px`;
  }, 300);
};

const emptyThumbComponent = () => `<article class="attending-next-thumb"></article>`;

const featureEvent = (key) => {
  const featuredEvent = document.getElementById('my-events');

  featuredEvent.innerHTML = eventComponent(Db.events[key], false, true);

  [...document.getElementsByClassName('attending-next-thumb')].forEach((thumb) => {
    if (thumb.getAttribute('name') * 1 === key * 1) {
      thumb.classList.add('selected');
    } else {
      thumb.classList.remove('selected');
    }
  });
};

const tempMessage = (element, message, type = 'warn') => {
  element.innerHTML = message;
  element.classList = `alert-${type}`;
  element.classList.remove('leave');
  element.classList.add('show');

  setTimeout(() => {
    element.classList.add('leave');
    element.classList.remove('show');
  }, 3500);
};

const emptyNoteComponent = (container) => {
  if (container === 'applied') {
    return `<p>You haven't applied to any event yet.</p>
    <p>Find an event to attend below <i class="far fa-hand-point-down"></i></p>`
  }
};

const selectComponent = () => {
  return `<div class="tooltip-owner user-selector" name="users" id="user-select">
  <i class="fas fa-chevron-down"></i>
  <div class="tooltip tooltip-column">
    <a href='#' class='user' data-user='-1' default>Visitor</a>
  </div>
  </div>`;
};

const welcomeComponent = () => {
  return `<article class='visitor-welcome'>
  <h1>Welcome to the events app!</h1>
  <p>Please, select one of the available users below to login.</p>
  ${selectComponent()}
</article>`;
};

const emptyEvents = () => {
  return '<p>There are no remaining events to apply</p><p>check again later... <i class="fas fa-frog"></i></p>';
};

const showUsers = () => {
  document.getElementById('change-user').classList.toggle('user-selector-open');
};

window.onload = () => {
  const userGreet = document.getElementById('current-user-greet');
  const userPic = document.getElementById('current-user-pic');
  const changeUser = document.getElementById('change-user');
  const eventContainer = document.getElementById('events');
  const applyedEvents = document.getElementById('my-events');
  const alertContainer = document.getElementById('alert');
  const pastEventContainer = document.getElementById('past-events');
  const loader = document.getElementById('loader');

  const loaderOn = () => {
    loader.classList.remove('load-over');
  }; 

  const loaderOver = (time) => {
    setTimeout(() => {
      loader.classList.add('load-over');
    }, time);
  };

  loaderOver(1600);

  const populateEvents = (user) => {
    const events2Show = {
      attending: [],
      main: [],
      past: [],
    };
    Object.keys(Db.events).forEach((key) => {
      if (key !== 'nextId') {
        if (user && user.events.includes(key)) {
          events2Show.attending.push({ ...Db.events[key], container: applyedEvents });
        } else if (Db.events[key].date.getTime() >= Date.now()) {
          events2Show.main.push({ ...Db.events[key], container: eventContainer });
        } else {
          events2Show.past.push({ ...Db.events[key], container: pastEventContainer });
        }
      }
    });
    return events2Show;
  };

  const addEvent2Btns = () => {
    Array.from(document.getElementsByClassName('apply-btn')).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const event = Db.events[btn.dataset.event];
        const { logged } = loggedUser;
        const curUser = logged();
        if (!loggedUser.logged()) {
          tempMessage(alertContainer, '<i class="fas fa-exclamation-triangle"></i> Login first to apply', 'error');
        } else {
          const newAttending = UserEvent({ userId: curUser.id, eventId: btn.dataset.event });
          if (newAttending === 'NOT_PREMIUM_ERROR') {
            curUser.CTAcount += 1;

            if (curUser.CTAcount > 2) {
              tempMessage(alertContainer, '<i class="fas fa-exclamation-triangle"></i> Sorry, this even is for premium users only. <a href="#">Learn more about premium memberships</a>');
            } else {
              openPremiumModal();
            }
          } else if (newAttending !== 'ALREADY_APPLYED_ERROR') {
            logged().events.push(btn.dataset.event);
            document.getElementById(`${btn.dataset.event}`).remove();

            if (eventContainer.childElementCount === 0) {
              eventContainer.classList.add('empty');
              eventContainer.innerHTML = emptyEvents();
            } else {
              eventContainer.classList.remove('empty');
            }

            if (applyedEvents.classList.contains('events-empty')) {
              applyedEvents.classList.remove('events-empty');
              applyedEvents.innerHTML = '';
              applyedEvents.innerHTML = eventComponent(event, false, true);
              document.getElementById('attending-next').classList.remove('hidden');
            }

            [...document.getElementsByClassName('attending-next-thumb')].some((thumb) => {
              if (thumb.childElementCount === 0) {
                thumb.innerHTML = eventComponent(event, false, true, true);
                thumb.setAttribute('name', event.id);
                return true;
              }
            });

            document.getElementById('attending-next').innerHTML += emptyThumbComponent();

            tempMessage(alertContainer, `<i class="fas fa-check-circle"></i> You are now taking part at ${event.title}`, 'success');
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

  const addEvents2Dom = ({ attending, main, past }) => {
    const eventContainer = document.getElementById('events');
    const pastEventContainer = document.getElementById('past-events');
    const applyedListParent = document.getElementById('attending-next');
    const applyedList = document.getElementsByClassName('attending-next-thumb');
    applyedEvents.innerHTML = '';
    eventContainer.innerHTML = '';
    pastEventContainer.innerHTML = '';

    past.forEach((event) => {
      pastEventContainer.innerHTML += eventComponent(event, true);
    });

    main.forEach((event) => {
      eventContainer.innerHTML += eventComponent(event, false, event.container === applyedEvents && true);
    });

    [...applyedList].forEach((thumb) => {
      thumb.innerHTML = '';
      thumb.classList = 'attending-next-thumb';
    });

    applyedListParent.innerHTML = `<h3 class="max-1200">My events</h3>${emptyThumbComponent().repeat(attending.length + 1)}`;
    attending.forEach((event, i) => {
      if (i === 0) {
        applyedEvents.innerHTML = eventComponent(event, false, event.container === applyedEvents && true);
      }
      [...applyedList][i].innerHTML += eventComponent(event, false, event.container === applyedEvents && true, true);
      [...applyedList][i].setAttribute('name', event.id);
    });

    if (applyedEvents.childElementCount === 0) {
      applyedEvents.classList.add('events-empty');
      applyedEvents.innerHTML = emptyNoteComponent('applied');
      document.getElementById('attending-next').classList.add('hidden');
    } else {
      applyedEvents.classList.remove('events-empty');
      document.getElementById('attending-next').classList.remove('hidden');
    }

    if (eventContainer.childElementCount === 0) {
      eventContainer.classList.add('empty');
      eventContainer.innerHTML = emptyEvents();
    } else {
      eventContainer.classList.remove('empty');
    }
  };

  const events = populateEvents(loggedUser.logged());
  const sortedEvents = {
    attending: sortEvents(events.attending, 1),
    main: sortEvents(events.main, 1),
    past: sortEvents(events.past, -1),
  };

  addEvents2Dom(sortedEvents);

  addEvent2Btns();

  const populateUsers = (id) => {
    const selector = document.getElementById(id);
    const tooltip = selector.querySelector('.tooltip');

    for (const key in Db.users) {
      const { id, firstName, premium } = Db.users[key];
      if (key !== 'nextId') {
        selector.querySelector('.tooltip').innerHTML += `<a class='user' data-user=${id}>${firstName} (${premium ? 'premium' : 'regular'})</a>`;
      }
    }

    selector.addEventListener('click', (e) => {
      if (selector.id !== 'change-user') {
        selector.classList.toggle('user-selector-open');        
      }
      e.stopPropagation();
    });
  };

  const addEventToUserSelect = () => {
    Array.from(document.querySelectorAll('.user')).forEach((user) => {
      user.addEventListener('click', () => {
        loaderOn();
        loaderOver(2000);
        const clickedUser = Db.users[user.dataset.user];
        loggedUser.login(clickedUser);
        checkLoggedUser();
      });
    });
  };

  const checkLoggedUser = () => {
    const user = loggedUser.logged();
    if (user) {
      document.getElementById('change-user').classList.remove('hidden');
      userGreet.innerHTML = `Welcome, ${user.firstName}`;
      userPic.innerHTML = `${user.premium ? '<i class="fa fa-star premium-pic-star"></i><div class="premium-user ' : '<div class="'}current-user-pic"><img class='profile-pic' src='${user.picture}' alt='profile-image'/></div>`;
      changeUser.classList.add('tooltip-owner');
      changeUser.setAttribute('onclick', 'showUsers()');
      changeUser.innerHTML = '<i class="fas fa-caret-down"></i><div class="tooltip tooltip-column"><a href="#" class="user" data-user="-1" default="">Visitor</a></div>';
      populateUsers('change-user');
      const currentEvents = populateEvents(user);
      const sorEvents = {
        attending: sortEvents(currentEvents.attending, 1),
        main: sortEvents(currentEvents.main, 1),
        past: sortEvents(currentEvents.past, -1),
      };

      addEvents2Dom(sorEvents);
      addEvent2Btns();
      addEventToUserSelect();
    } else {
      applyedEvents.classList.add('events-empty');
      userGreet.innerHTML = 'Hi, Visitor';
      userPic.innerHTML = '';
      changeUser.innerHTML = '';
      applyedEvents.innerHTML = welcomeComponent();
      populateUsers('user-select');
      addEventToUserSelect();
      document.getElementById('attending-next').classList.add('hidden');
      document.getElementById('change-user').classList.add('hidden');
    }
  };

  checkLoggedUser();

  addEventToUserSelect();

  addEvent2Btns();
};
