import { Minecraft, dim } from "scripts/lib/yoni/basis.js";
import { Command } from "scripts/lib/yoni/command.js";

//need more info

export class YoniEntity {
  #entity;
  get entity() {
    return this.#entity;
  }
  set entity() {
    throw new Error();
  }
  constructor(vanillaEntity) {
    if (!isMinecraftEntity(vanillaEntity))
      throw new TypeError("Not a vanilla entity")
    this.#entity = vanillaEntity;
    for (let val in vanillaEntity) {
      if (typeof this[val] == "undefined" && typeof vanillaEntity[val] == "function")
        this[val] = function(...args){ return this.#entity[val](...args)}
    }
  }

  isEntity() {
    return isEntity(this.#entity);
  }
  isAliveEntity() {
    return isAliveEntity(this.#entity);
  }
  hasFamily(family) {
    return hasFamily(this.#entity, familiy);
  }
  hasAnyFamily(...families) {
    return hasAnyFamily(this.#entity, ...families);
  }


}

export default class Entity {
  constructor(entity){
    if (isYoniEntity(entity)) //如果已经封装为YoniEntity，则直接返回原实体
      return entity;
    if (!isMinecraftEntity(entity)) //如果不是MCEntity则报错
      throw new TypeError();
    return new YoniEntity(entity); //如果是MCEntity则保存
  }
  static isEntity(object){
    return isEntity(object);
  }
  static isAliveEntity(object){
    return isAliveEntity(object);
  }
  static hasFamily(entity, family){
    return hasFamily(entity, family);
  }
  static hasAnyFamily(entity, ...families){
    return hasAnyFamily(entity, ...families);
  }
  static resolveTargetSelector(selector){
    return resolveTargetSelector(selector);
  }
  static resolveTargetSelectors(...selectors){
    return resolveTargetSelectors(...selectors);
  }
  static getLoadedEntities(){
    return getLoadedEntities();
  }
}

function isMinecraftEntity(object){
  if (object instanceof Minecraft.Entity)
    return true;
  return false
}

function isEntity(object){
  if (isYoniEntity(object))
    return true;
  if (isMinecraftEntity(object))
    return true;
  return false;
}

function isYoniEntity(object){
  if (object instanceof YoniEntity)
    return true;
}

function isAliveEntity(entity){
  if (!isEntity(object))
    return false;
  if (typeof object != "object")
    return false;
  getLoadedEntities().forEach((entity)=>{
    if (object === entity)
      return true;
  });
  return false;
}

isSameEntity(ent1, ent2){
  
}


function isAlive(entity){
  if (!isEntity(entity))
    return false;
  try {
    return entity.getComponent("minecraft:health").currnet > 0;
  } catch {
    return false;
  }
}

function hasFamily(entity, family){
  return hasAnyFamily(entity, family);
}

function hasAnyFamily(entity, ...families){
  families.forEach((conditionFamily)=> {
    conditionFamily = String(conditionFamily);
    let command = "execute if entity @s[family="+conditionFamily+"]";
    if (Command.run(command).statusCode == 0)
      return true;
  });
  return false;
}



function resolveTargetSelectors(...selectors){
  let selectedEntities = [];
  selectors.forEach((selector) => {
    resolveTargetSelector(selector).forEach((entity) => {
      if (selectedEntities.indexOf(entity) == -1)
        selectedEntities.push(entity);
    });
  });
}

function resolveTargetSelector(selector){
  let selectedEntities = [];

  try {
    let tag = String(Math.random());
    Command.run(`tag ${selector} add "${tag}"`);
    getLoadedEntities().forEach((entity) => {
      if (entity.hasTag(tag))
        selectedEntities.push(entity);
    });
    Command.run(`tag ${selector} remove "${tag}"`);

  } catch {
    selectedEntities = [];
  }

  return selectedEntities;
}

function getLoadedEntities(){
  let loadedEntities = [];
  let dimid = [0,-1,1];
  dimid.forEach((id) => {
    dim(id).getEntities().forEach((entity) => {
      loadedEntities.push(entity);
    });
  });
  return loadedEntities;
}
