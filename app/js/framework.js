// MIT by Stefan :)
export const findByQuery = selector => document.querySelector(selector);
export const findAll = selector => document.querySelectorAll(selector);
export const findById = id => document.getElementById(id);
export const findByName = name => document.getElementsByName(name);
export const listenEvent = (target, eventName, fn) =>
  target.addEventListener(eventName, fn);
export const listenEventAll = (targets, eventName, fn) =>
  targets.forEach(target => {
    listenEvent(target, eventName, fn);
  });
