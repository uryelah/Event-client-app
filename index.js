// USER
//id Int
//firstName str
//lastName
//premium bool
//email
//events [id]
// reference to a join table with status of application

const capitalize = (name) => {
  let capitalized = name[0].toUpperCase() + name.substring(1);

  return capitalized;
};

let loggedUser = (() => {
  let user = null;
  const login = (obj) => {
    user = obj;
  };

  const logged = () => user;

  return {
    logged,
    login
  }
})();

const Db = (() => {
  return {
    users: {
      nextId: 0,
    },
    events: {
      nextId: 0,
    },
    userEvent: {
      nextId: 0,
    },
  }
})();

const User = (userObj) => {
  let { firstName, lastName, } = userObj;
  const { premium, email } = userObj;
  const events = [];
  let id = Db.users.nextId;

  const newUser = {
    id: id,
    firstName: capitalize(firstName),
    lastName: capitalize(lastName),
    premium: premium,
    email: email,
    events: events,
  }

  Db.users[id] = newUser;
  Db.users.nextId += 1;

  return newUser;
};

const Event = (eventObj) => {
  const { type, title, description, location, date, deadLine, premium, country } = eventObj;

  const attendants = [];
  const shareCount = 0;
  let id = Db.events.nextId;

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
      console.log('This is a premium only event!');
      return false;
    }
  }

  for (let key in Db.userEvent) {
    if (key !== 'nextId') {
      if (Db.userEvent[key].userId === userId && Db.userEvent[key].eventId === eventId) {
        console.log('Repeated record, return.');
        return false;
      }
    }
  }

  let id = Db.userEvent.nextId;

  const newJoin = { id, userId, eventId };

  Db.userEvent[id] = newJoin;
  Db.userEvent.nextId += 1;

  return newJoin;
};

let charly = User({ firstName: 'Charly', lastName: 'Adamns', premium: false, email: 'charchar@mail.com' });
console.log(charly);
let winona = User({ firstName: 'Winona', lastName: 'Rider', premium: true, email: 'charchar@mail.com' });
console.log(winona)

let recruitment = Event({ type: 'Leap', premium: false, title: 'Leap into Canada', description: '...', country: 'Canada', location: 'Sao Paulo', date: 'Mon 2 2020', deadLine: 'Mon 1 2020'});
console.log(recruitment);
let mission = Event({ type: 'Mission', premium: true, title: 'Mission Latin America', description: '...', country: 'Canada', location: 'Sao Paulo', date: 'Mon 2 2020', deadLine: 'Mon 1 2020'});
console.log(mission);

//let charly2mission = UserEvent({ userId: 0, eventId: 1 });
//console.log(charly2mission);
//let winona2mission = UserEvent({ userId: 0, eventId: 1 });
//console.log(winona2mission);

// EVENT
//id
//type [Leap, Recruiting Mission, VanHackathon,Meetup,  Premium-only Webnar, Open Webnar]
// first 3, index 0-2, more attention
// attendants, through join table
// details
// share count


/// DOM STUFF
window.onload = () => {
  const userSelect = document.getElementById("user-select");
  const userGreet = document.getElementById('current-user-greet');  
  const eventContainer = document.getElementById('events');
  const applyedEvents = document.getElementById('my-events');

  for (let key in Db.users) {
    if (key !== 'nextId') {
      userSelect.innerHTML += `<option class='user' data-user=${Db.users[key].id}>${Db.users[key].firstName}(${Db.users[key].premium ? 'premium' : 'regular'})</option>`
    }
  };

  for (let key in Db.events) {
    if (key !== 'nextId') {
      eventContainer.innerHTML += `<article class='event' data-event='${Db.events[key].id}'>
<h2>${Db.events[key].title}</h2>
<small>${Db.events[key].date}</small>
<br/>
<small>${Db.events[key].location}</small>
<p>${Db.events[key].description}</p>
<br/>
<strong>Deadline:</strong>
<small>${Db.events[key].deadLine}</small>
<br/>
<button class='apply-btn' data-event='${Db.events[key].id}' type='button'>APPLY</button>
</article>`
    }
  }

  const checkLoggedUser = () => {
    if (loggedUser.logged()) {
      userGreet.innerHTML = `Welcome, ${loggedUser.logged().firstName}`;
      applyedEvents.innerHTML = '';

      for (let key in Db.userEvent) {
        if (key !== 'nextId') {
          if (Db.userEvent[key].userId == loggedUser.logged().id) {
            applyedEvents.innerHTML += `${Db.events[Db.userEvent[key].eventId].title}`
          }
        }
      };
    } else {
      userGreet.innerHTML = 'Login to use this app.';
      applyedEvents.innerHTML = '';
    }
  };

  checkLoggedUser();

  Array.from(userSelect.querySelectorAll('.user')).forEach(user => {
    user.addEventListener('click', () => {
      console.log(user.dataset.user)
      const clickedUser = Db.users[user.dataset.user];
      loggedUser.login(clickedUser);
      checkLoggedUser();
    });
  });

  Array.from(document.getElementsByClassName('apply-btn')).forEach(btn => {
    btn.addEventListener('click', () => {
      if (!loggedUser.logged()) {
        alert('Login first to apply');
      } else {
        const newAttending = UserEvent({ userId: loggedUser.logged().id, eventId: btn.dataset.event });
        if (newAttending) {
          applyedEvents.innerHTML += `<p>${Db.events[btn.dataset.event].title}</p>`
        }
      }
    });
  });
};