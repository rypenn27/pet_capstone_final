import bassetHound from './pet_images/bassetHound.jpg';
import collie from './pet_images/collie.jpg';
import corgi from './pet_images/corgi.jpg';
import dalmatian from './pet_images/dalmatian.jpg';
import dobermann from './pet_images/dobermann.jpg';
import englishBulldog from './pet_images/englishBulldog.jpg';
import frenchBulldog from './pet_images/frenchBulldog.jpg';
import germanShepherd from './pet_images/germanShepherd.jpg';
import greatDane from './pet_images/greatDane.jpg';
import irishSetter from './pet_images/irishSetter.jpg';
import italianGreyhound from './pet_images/italianGreyhound.jpg';
import labrador from './pet_images/labrador.jpg';
import pitbull from './pet_images/pitbull.jpg';
import pomeranian from './pet_images/pomeranian.jpg';
import poodle from './pet_images/poodle.jpg';
import rottweiler from './pet_images/rottweiler.jpg';
import sheltie from './pet_images/sheltie.jpg';
import terrier from './pet_images/terrier.jpg';
import yorkie from './pet_images/yorkie.jpg';
import fallback from './PetIcon.jpg';

const byBreed = {
  'Basset Hound': bassetHound,
  'Collie': collie,
  'Corgi': corgi,
  'Dalmatian': dalmatian,
  'Dobermann': dobermann,
  'English Bulldog': englishBulldog,
  'French Bulldog': frenchBulldog,
  'German Shepherd': germanShepherd,
  'Great Dane': greatDane,
  'Irish Setter': irishSetter,
  'Italian Greyhound': italianGreyhound,
  'Labrador': labrador,
  'Pitbull': pitbull,
  'Pomeranian': pomeranian,
  'Poodle': poodle,
  'Rottweiler': rottweiler,
  'Sheltie': sheltie,
  'Terrier': terrier,
  'Yorkie': yorkie,
};

export const petImage = (breed) => byBreed[breed] || fallback;
