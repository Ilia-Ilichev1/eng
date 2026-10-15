import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';
import { openDb, isDbEmpty } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function seed(db) {
  if (!isDbEmpty(db)) {
    return { skipped: true };
  }
  seedLessons(db);
  seedWords(db);
  return { skipped: false };
}

function seedLessons(db) {
  const insertLesson = db.prepare(
    'INSERT INTO lessons (title, description, level, "order") VALUES (?, ?, ?, ?)'
  );
  const insertExercise = db.prepare(
    'INSERT INTO exercises (lesson_id, type, prompt, explanation, answer, "order") VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertOption = db.prepare(
    'INSERT INTO exercise_options (exercise_id, text, is_correct, "order") VALUES (?, ?, ?, ?)'
  );

  const lessons = [
    {
      title: 'Greetings and Introductions',
      description: 'Learn how to greet people, introduce yourself, and ask basic questions.',
      level: 'A1',
      order: 1,
      exercises: [
        {
          type: 'mcq',
          prompt: 'Choose the correct greeting for the morning:',
          explanation: '"Good morning" is used until around noon.',
          options: [
            { text: 'Good morning', is_correct: 1 },
            { text: 'Good night', is_correct: 0 },
            { text: 'See you later',is_correct: 0 },
            { text: 'Excuse me',is_correct:  0 },
          ],
        },
        {
          type: 'fill_blank',
          prompt: 'Complete: "Hello, my ___ is Anna."',
          explanation: 'We say "my name is" when introducing yourself.',
          answer: 'name',
        },
        {
          type: 'mcq',
          prompt: 'What do you say when you leave someone?',
          explanation: '"Goodbye" is the standard way to say farewell.',
          options: [
            { text: 'Hello',is_correct: 0 },
            { text: 'Goodbye',is_correct: 1 },
            { text: 'Thank you',is_correct:  0 },
            { text: 'Sorry',is_correct:  0 },
          ],
        },
        {
          type: 'translation',
          prompt: 'Translate to English: "Как дела?"',
          explanation: '"How are you?" is the common way to ask how someone is doing.',
          answer: 'How are you?',
        },
        {
          type: 'fill_blank',
          prompt: 'Complete: "Nice to ___ you."',
          explanation: 'We say "Nice to meet you" when meeting someone for the first time.',
          answer: 'meet',
        },
        {
          type: 'mcq',
          prompt: 'Which question asks for someone\'s name?',
          explanation: '"What is your name?" is the direct question for a name.',
          options: [
            { text: 'Where are you from?',is_correct: 0 },
            { text: 'What is your name?',is_correct:  1 },
            { text: 'How old are you?',is_correct:  0 },
            { text: 'What time is it?',is_correct:  0 },
          ],
        },
      ],
    },
    {
      title: 'Everyday Verbs',
      description: 'Practice common action verbs used in daily life.',
      level: 'A1',
      order: 2,
      exercises: [
        {
          type: 'fill_blank',
          prompt: 'Complete: "I ___ coffee every morning." (drink/drinks)',
          explanation: 'With "I" we use the base form "drink".',
          answer: 'drink',
        },
        {
          type: 'mcq',
          prompt: 'Choose the past form of "go":',
          explanation: '"Go" is irregular: its past form is "went".',
          options: [
            { text: 'goed',is_correct:  0 },
            { text: 'went',is_correct:  1 },
            { text: 'gone',is_correct:  0 },
            { text: 'going',is_correct:  0 },
          ],
        },
        {
          type: 'translation',
          prompt: 'Translate to English: "Она читает книгу."',
          explanation: '"She reads a book." — "reads" is the third-person singular form.',
          answer: 'She reads a book.',
        },
        {
          type: 'mcq',
          prompt: 'Which verb means "работать"?',
          explanation: '"To work" is the English verb for "работать".',
          options: [
            { text: 'walk',is_correct:  0 },
            { text: 'work',is_correct:  1 },
            { text: 'wish',is_correct:  0 },
            { text: 'wake',is_correct:  0 },
          ],
        },
        {
          type: 'fill_blank',
          prompt: 'Complete: "She ___ to school by bus." (go/goes)',
          explanation: 'In the third person singular, "go" becomes "goes".',
          answer: 'goes',
        },
        {
          type: 'mcq',
          prompt: 'Choose the correct negative: "He ___ like tea."',
          explanation: 'With "he/she/it" the negative of the present simple uses "doesn\'t".',
          options: [
            { text: 'don\'t',is_correct:  0 },
            { text: 'doesn\'t',is_correct:  1 },
            { text: 'isn\'t',is_correct:  0 },
            { text: 'aren\'t',is_correct:  0 },
          ],
        },
      ],
    },
    {
      title: 'Food and Shopping',
      description: 'Vocabulary and phrases for food, prices, and buying things.',
      level: 'A2',
      order: 3,
      exercises: [
        {
          type: 'fill_blank',
          prompt: 'Complete: "How ___ is this apple?"',
          explanation: 'We ask about price with "How much".',
          answer: 'much',
        },
        {
          type: 'mcq',
          prompt: 'What do you call a place that sells bread?',
          explanation: 'A "bakery" is a shop that sells bread and cakes.',
          options: [
            { text: 'butcher',is_correct:  0 },
            { text: 'bakery',is_correct:  1 },
            { text: 'market',is_correct:  0 },
            { text: 'café',is_correct:  0 },
          ],
        },
        {
          type: 'translation',
          prompt: 'Translate to English: "Сколько стоит этот суп?"',
          explanation: '"How much is this soup?" is the natural way to ask a price.',
          answer: 'How much is this soup?',
        },
        {
          type: 'mcq',
          prompt: 'Choose the uncountable noun:',
          explanation: '"Milk" is uncountable: we say "some milk", not "a milk".',
          options: [
            { text: 'apple',is_correct:  0 },
            { text: 'milk',is_correct:  1 },
            { text: 'egg',is_correct:  0 },
            { text: 'biscuit',is_correct:  0 },
          ],
        },
        {
          type: 'fill_blank',
          prompt: 'Complete: "I would ___ a cup of tea, please."',
          explanation: '"I would like" is the polite way to order something.',
          answer: 'like',
        },
        {
          type: 'mcq',
          prompt: 'What is "сдача" in a shop?',
          explanation: '"Change" is the money you get back when you pay with more than the price.',
          options: [
            { text: 'change',is_correct:  1 },
            { text: 'choice',is_correct:  0 },
            { text: 'charge',is_correct:  0 },
            { text: 'check',is_correct:  0 },
          ],
        },
        {
          type: 'translation',
          prompt: 'Translate to English: "Я хотел бы купить хлеба."',
          explanation: '"I would like to buy some bread." — "would like to" expresses a wish.',
          answer: 'I would like to buy some bread.',
        },
      ],
    },
    {
      title: 'Travel and Directions',
      description: 'Useful phrases for finding your way and traveling around town.',
      level: 'A2',
      order: 4,
      exercises: [
        {
          type: 'mcq',
          prompt: 'What do you ask to find a place?',
          explanation: '"Excuse me, where is the station?" is a natural way to ask for directions.',
          options: [
            { text: 'Excuse me, where is the station?',is_correct:  1 },
            { text: 'Excuse me, what is the station?',is_correct:  0 },
            { text: 'Excuse me, when is the station?',is_correct:  0 },
            { text: 'Excuse me, why is the station?',is_correct:  0 },
          ],
        },
        {
          type: 'fill_blank',
          prompt: 'Complete: "Turn ___ at the traffic lights." (left/right)',
          explanation: '"Turn left" and "turn right" are the standard instructions for directions.',
          answer: 'left',
        },
        {
          type: 'translation',
          prompt: 'Translate to English: "Как пройти до вокзала?"',
          explanation: '"How do I get to the station?" is the common way to ask the way.',
          answer: 'How do I get to the station?',
        },
        {
          type: 'mcq',
          prompt: 'What is "билет"?',
          explanation: 'A "ticket" is what you buy to travel by train, bus, or plane.',
          options: [
            { text: 'ticket',is_correct:  1 },
            { text: 'table',is_correct:  0 },
            { text: 'tower',is_correct:  0 },
            { text: 'taxi',is_correct:  0 },
          ],
        },
        {
          type: 'fill_blank',
          prompt: 'Complete: "The museum is ___ the bank and the post office."',
          explanation: '"Between" means in the middle of two places.',
          answer: 'between',
        },
        {
          type: 'mcq',
          prompt: 'Which word means "поезд"?',
          explanation: '"Train" is the English word for "поезд".',
          options: [
            { text: 'plain',is_correct:  0 },
            { text: 'train',is_correct:  1 },
            { text: 'track',is_correct:  0 },
            { text: 'trip',is_correct:  0 },
          ],
        },
        {
          type: 'translation',
          prompt: 'Translate to English: "Где автобусная остановка?"',
          explanation: '"Where is the bus stop?" — "bus stop" is "автобусная остановка".',
          answer: 'Where is the bus stop?',
        },
      ],
    },
  ];

  const seedTransaction = db.transaction(() => {
    for (const lesson of lessons) {
      const lessonId = insertLesson.run(lesson.title, lesson.description, lesson.level, lesson.order).lastInsertRowid;
      lesson.exercises.forEach((exercise, index) => {
        const exId = insertExercise.run(lessonId, exercise.type, exercise.prompt, exercise.explanation || '', exercise.answer || '', index +  1).lastInsertRowid;
        if (exercise.options) {
          exercise.options.forEach((opt, i) => {
            insertOption.run(exId, opt.text, opt.is_correct, i +1);
          });
        }
      });
    }
  });
  seedTransaction();
}

const WORDS = [
  { term: 'hello',translation: 'привет',definition: 'a word used as a greeting',example: 'Hello, how are you?',part_of_speech: 'interjection',level: 'A1',tags: ['greetings'] },
  { term: 'goodbye',translation: 'до свидания',definition: 'a word said when leaving',example: 'She said goodbye and left.',part_of_speech: 'interjection',level: 'A1',tags: ['greetings'] },
  { term: 'please',translation: 'пожалуйста',definition: 'used to ask politely',example: 'A cup of tea, please.',part_of_speech: 'adverb',level: 'A1',tags: ['politeness'] },
  { term: 'thank you',translation: 'спасибо',definition: 'polite expression of gratitude',example: 'Thank you for your help.',part_of_speech: 'phrase',level: 'A1',tags: ['politeness'] },
  { term: 'sorry',translation: 'извините',definition: 'expressing apology',example: 'Sorry, I am late.',part_of_speech: 'adjective',level: 'A1',tags: ['politeness'] },
  { term: 'name',translation: 'имя',definition: 'the word people call you',example: 'My name is Anna.',part_of_speech: 'noun',level: 'A1',tags: ['people'] },
  { term: 'friend',translation: 'друг',definition: 'a person you like and trust',example: 'He is my best friend.',part_of_speech: 'noun',level: 'A1',tags: ['people'] },
  { term: 'family',translation: 'семья',definition: 'parents, children, and relatives',example: 'My family is large.',part_of_speech: 'noun',level: 'A1',tags: ['people'] },
  { term: 'mother',translation: 'мать',definition: 'a female parent',example: 'My mother cooks well.',part_of_speech: 'noun',level: 'A1',tags: ['people', 'family'] },
  { term: 'father',translation: 'отец',definition: 'a male parent',example: 'My father works in a bank.',part_of_speech: 'noun',level: 'A1',tags: ['people', 'family'] },
  { term: 'house',translation: 'дом',definition: 'a building where people live',example: 'They live in a big house.',part_of_speech: 'noun',level: 'A1',tags: ['home'] },
  { term: 'water',translation: 'вода',definition: 'a clear liquid we drink',example: 'I drink water every day.',part_of_speech: 'noun',level: 'A1',tags: ['food'] },
  { term: 'bread',translation: 'хлеб',definition: 'a baked food made from flour',example: 'She bought fresh bread.',part_of_speech: 'noun',level: 'A1',tags: ['food'] },
  { term: 'milk',translation: 'молоко',definition: 'a white drink from cows',example: 'The child drinks milk.',part_of_speech: 'noun',level: 'A1',tags: ['food'] },
  { term: 'apple',translation: 'яблоко',definition: 'a round red or green fruit',example: 'An apple a day keeps the doctor away.',part_of_speech: 'noun',level: 'A1',tags: ['food', 'fruit'] },
  { term: 'tea',translation: 'чай',definition: 'a hot drink made from leaves',example: 'Would you like some tea?',part_of_speech: 'noun',level: 'A1',tags: ['food', 'drink'] },
  { term: 'coffee',translation: 'кофе',definition: 'a hot dark drink with caffeine',example: 'I need a cup of coffee.',part_of_speech: 'noun',level: 'A1',tags: ['food', 'drink'] },
  { term: 'eat',translation: 'есть',definition: 'to put food in your mouth',example: 'We eat dinner at seven.',part_of_speech: 'verb',level: 'A1',tags: ['verbs', 'food'] },
  { term: 'drink',translation: 'пить',definition: 'to take liquid in',example: 'You should drink more water.',part_of_speech: 'verb',level: 'A1',tags: ['verbs', 'food'] },
  { term: 'go',translation: 'идти',definition: 'to move from one place to another',example: 'I go to school by bus.',part_of_speech: 'verb',level: 'A1',tags: ['verbs', 'travel'] },
  { term: 'come',translation: 'приходить',definition: 'to move toward the speaker',example: 'Please come here.',part_of_speech: 'verb',level: 'A1',tags: ['verbs', 'travel'] },
  { term: 'see',translation: 'видеть',definition: 'to notice with your eyes',example: 'I can see the mountains.',part_of_speech: 'verb',level: 'A1',tags: ['verbs'] },
  { term: 'work',translation: 'работать',definition: 'to do a job or task',example: 'She works at a hospital.',part_of_speech: 'verb',level: 'A1',tags: ['verbs', 'work'] },
  { term: 'sleep',translation: 'спать',definition: 'to rest with eyes closed',example: 'Babies sleep a lot.',part_of_speech: 'verb',level: 'A1',tags: ['verbs', 'daily'] },
  { term: 'read',translation: 'читать',definition: 'to look at words and understand them',example: 'I read a book every week.',part_of_speech: 'verb',level: 'A1',tags: ['verbs', 'daily'] },
  { term: 'write',translation: 'писать',definition: 'to make letters or words',example: 'Please write your name here.',part_of_speech: 'verb',level: 'A1',tags: ['verbs', 'daily'] },
  { term: 'listen',translation: 'слушать',definition: 'to pay attention to sound',example: 'We listen to music in the car.',part_of_speech: 'verb',level: 'A1',tags: ['verbs', 'daily'] },
  { term: 'speak',translation: 'говорить',definition: 'to say words, to talk',example: 'Do you speak English?',part_of_speech: 'verb',level: 'A1',tags: ['verbs', 'communication'] },
  { term: 'buy',translation: 'покупать',definition: 'to get something by paying money',example: 'I want to buy a new phone.',part_of_speech: 'verb',level: 'A1',tags: ['verbs', 'shopping'] },
  { term: 'big',translation: 'большой',definition: 'large in size',example: 'They have a big garden.',part_of_speech: 'adjective',level: 'A1',tags: ['describing'] },
  { term: 'small',translation: 'маленький',definition: 'little in size',example: 'A small dog lives next door.',part_of_speech: 'adjective',level: 'A1',tags: ['describing'] },
  { term: 'good',translation: 'хороший',definition: 'of high quality or standard',example: 'This is a good idea.',part_of_speech: 'adjective',level: 'A1',tags: ['describing'] },
  { term: 'bad',translation: 'плохой',definition: 'of low quality or standard',example: 'The weather is bad today.',part_of_speech: 'adjective',level: 'A1',tags: ['describing'] },
  { term: 'new',translation: 'новый',definition: 'recently made or bought',example: 'I got a new jacket.',part_of_speech: 'adjective',level: 'A1',tags: ['describing'] },
  { term: 'old',translation: 'старый',definition: 'having lived or existed many years',example: 'This is an old church.',part_of_speech: 'adjective',level: 'A1',tags: ['describing'] },
  { term: 'happy',translation: 'счастливый',definition: 'feeling pleasure and joy',example: 'She looks very happy today.',part_of_speech: 'adjective',level: 'A1',tags: ['feelings'] },
  { term: 'sad',translation: 'грустный',definition: 'feeling unhappy',example: 'He was sad about the news.',part_of_speech: 'adjective',level: 'A1',tags: ['feelings'] },
  { term: 'morning',translation: 'утро',definition: 'the early part of the day',example: 'I run in the morning.',part_of_speech: 'noun',level: 'A1',tags: ['time'] },
  { term: 'evening',translation: 'вечер',definition: 'the end of the day before night',example: 'We watch TV in the evening.',part_of_speech: 'noun',level: 'A1',tags: ['time'] },
  { term: 'today',translation: 'сегодня',definition: 'this day',example: 'Today is Monday.',part_of_speech: 'adverb',level: 'A1',tags: ['time'] },
  { term: 'tomorrow',translation: 'завтра',definition: 'the day after today',example: 'See you tomorrow.',part_of_speech: 'adverb',level: 'A1',tags: ['time'] },
  { term: 'yesterday',translation: 'вчера',definition: 'the day before today',example: 'I met her yesterday.',part_of_speech: 'adverb',level: 'A1',tags: ['time'] },
  { term: 'school',translation: 'школа',definition: 'a place where children learn',example: 'The children walk to school.',part_of_speech: 'noun',level: 'A1',tags: ['places'] },
  { term: 'shop',translation: 'магазин',definition: 'a place where you buy things',example: 'The shop closes at six.',part_of_speech: 'noun',level: 'A1',tags: ['places', 'shopping'] },
  { term: 'street',translation: 'улица',definition: 'a road in a city with buildings',example: 'They live on a quiet street.',part_of_speech: 'noun',level: 'A1',tags: ['places', 'travel'] },
  { term: 'car',translation: 'машина',definition: 'a road vehicle with four wheels',example: 'Their car is parked outside.',part_of_speech: 'noun',level: 'A1',tags: ['travel', 'transport'] },
  { term: 'bus',translation: 'автобус',definition: 'a large road vehicle for many people',example: 'The bus arrives at nine.',part_of_speech: 'noun',level: 'A1',tags: ['travel', 'transport'] },
  { term: 'train',translation: 'поезд',definition: 'a vehicle that runs on rails',example: 'We took the train to Paris.',part_of_speech: 'noun',level: 'A1',tags: ['travel', 'transport'] },
  { term: 'city',translation: 'город',definition: 'a large town',example: 'Moscow is a big city.',part_of_speech: 'noun',level: 'A1',tags: ['places'] },
  { term: 'money',translation: 'деньги',definition: 'coins and paper used to buy things',example: 'I need to save money.',part_of_speech: 'noun',level: 'A1',tags: ['shopping'] },
  { term: 'expensive',translation: 'дорогой',definition: 'costing a lot of money',example: 'This restaurant is expensive.',part_of_speech: 'adjective',level: 'A2',tags: ['shopping', 'describing'] },
  { term: 'cheap',translation: 'дешевый',definition: 'costing little money',example: 'We found a cheap hotel.',part_of_speech: 'adjective',level: 'A2',tags: ['shopping', 'describing'] },
  { term: 'price',translation: 'цена',definition: 'the amount of money needed',example: 'The price of gas went up.',part_of_speech: 'noun',level: 'A2',tags: ['shopping'] },
  { term: 'ticket',translation: 'билет',definition: 'a paper that allows travel or entry',example: 'I bought a train ticket.',part_of_speech: 'noun',level: 'A2',tags: ['travel'] },
  { term: 'station',translation: 'вокзал, станция',definition: 'a place where trains or buses stop',example: 'The station is near the center.',part_of_speech: 'noun',level: 'A2',tags: ['travel'] },
  { term: 'airport',translation: 'аэропорт',definition: 'a place where planes take off and land',example: 'We arrived at the airport early.',part_of_speech: 'noun',level: 'A2',tags: ['travel'] },
  { term: 'map',translation: 'карта',definition: 'a drawing of an area that shows places',example: 'Let me check the map.',part_of_speech: 'noun',level: 'A2',tags: ['travel'] },
  { term: 'direction',translation: 'направление',definition: 'the way something faces or moves',example: 'We went in the wrong direction.',part_of_speech: 'noun',level: 'A2',tags: ['travel'] },
  { term: 'left',translation: 'налево, левый',definition: 'the side opposite the right',example: 'Turn left at the corner.',part_of_speech: 'adjective/noun',level: 'A2',tags: ['travel'] },
  { term: 'right',translation: 'направо, правый',definition: 'the side opposite the left',example: 'The bank is on the right.',part_of_speech: 'adjective/noun',level: 'A2',tags: ['travel'] },
  { term: 'straight',translation: 'прямо',definition: 'continuing in one direction',example: 'Go straight for two blocks.',part_of_speech: 'adverb',level: 'A2',tags: ['travel'] },
  { term: 'near',translation: 'близко, рядом',definition: 'at a short distance',example: 'The cafe is near the park.',part_of_speech: 'preposition',level: 'A2',tags: ['travel'] },
  { term: 'far',translation: 'далеко',definition: 'at a great distance',example: 'How far is the beach?',part_of_speech: 'adverb',level: 'A2',tags: ['travel'] },
  { term: 'between',translation: 'между',definition: 'in the space separating two things',example: 'The shop is between the banks.',part_of_speech: 'preposition',level: 'A2',tags: ['travel'] },
  { term: 'turn',translation: 'поворачивать',definition: 'to change direction',example: 'Turn right at the lights.',part_of_speech: 'verb',level: 'A2',tags: ['travel', 'verbs'] },
  { term: 'restaurant',translation: 'ресторан',definition: 'a place where meals are served',example: 'We had dinner at a restaurant.',part_of_speech: 'noun',level: 'A2',tags: ['food', 'places'] },
  { term: 'menu',translation: 'меню',definition: 'a list of food available',example: 'Can I see the menu, please?',part_of_speech: 'noun',level: 'A2',tags: ['food'] },
  { term: 'delicious',translation: 'вкусный',definition: 'very tasty',example: 'This soup is delicious.',part_of_speech: 'adjective',level: 'A2',tags: ['food', 'describing'] },
  { term: 'hungry',translation: 'голодный',definition: 'wanting to eat',example: 'I am hungry after work.',part_of_speech: 'adjective',level: 'A2',tags: ['food', 'feelings'] },
  { term: 'thirsty',translation: 'испытывающий жажду',definition: 'wanting to drink',example: 'Running made me thirsty.',part_of_speech: 'adjective',level: 'A2',tags: ['food', 'feelings'] },
  { term: 'breakfast',translation: 'завтрак',definition: 'the first meal of the day',example: 'I have breakfast at eight.',part_of_speech: 'noun',level: 'A1',tags: ['food', 'daily'] },
  { term: 'lunch',translation: 'обед',definition: 'a meal eaten in the middle of the day',example: 'We had lunch together.',part_of_speech: 'noun',level: 'A1',tags: ['food', 'daily'] },
  { term: 'dinner',translation: 'ужин',definition: 'the main meal in the evening',example: 'Dinner is ready.',part_of_speech: 'noun',level: 'A1',tags: ['food', 'daily'] },
  { term: 'vegetable',translation: 'овощ',definition: 'a plant eaten as food',example: 'Eat more vegetables.',part_of_speech: 'noun',level: 'A2',tags: ['food'] },
  { term: 'fruit',translation: 'фрукт',definition: 'sweet plant food like apples',example: 'Fruit is good for you.',part_of_speech: 'noun',level: 'A2',tags: ['food'] },
  { term: 'meat',translation: 'мясо',definition: 'animal flesh used as food',example: 'I do not eat meat.',part_of_speech: 'noun',level: 'A2',tags: ['food'] },
  { term: 'fish',translation: 'рыба',definition: 'an animal that lives in water; its meat',example: 'We had fish for lunch.',part_of_speech: 'noun',level: 'A2',tags: ['food'] },
  { term: 'egg',translation: 'яйцо',definition: 'an oval object from a bird, eaten as food',example: 'I had two eggs for breakfast.',part_of_speech: 'noun',level: 'A2',tags: ['food'] },
  { term: 'cheese',translation: 'сыр',definition: 'a food made from milk',example: 'A cheese sandwich, please.',part_of_speech: 'noun',level: 'A2',tags: ['food'] },
  { term: 'sugar',translation: 'сахар',definition: 'a sweet substance from plants',example: 'Do you take sugar in your tea?',part_of_speech: 'noun',level: 'A2',tags: ['food'] },
  { term: 'salt',translation: 'соль',definition: 'a white substance used to flavor food',example: 'Add a little salt to the soup.',part_of_speech: 'noun',level: 'A2',tags: ['food'] },
  { term: 'bag',translation: 'сумка, пакет',definition: 'a container for carrying things',example: 'She carries a shopping bag.',part_of_speech: 'noun',level: 'A1',tags: ['shopping'] },
  { term: 'shop assistant',translation: 'продавец',definition: 'a person who works in a shop',example: 'The shop assistant helped me.',part_of_speech: 'noun',level: 'A2',tags: ['shopping'] },
  { term: 'customer',translation: 'покупатель',definition: 'a person who buys something',example: 'The customer paid in cash.',part_of_speech: 'noun',level: 'A2',tags: ['shopping'] },
  { term: 'pay',translation: 'платить',definition: 'to give money for something',example: 'I will pay by card.',part_of_speech: 'verb',level: 'A2',tags: ['shopping', 'verbs'] },
  { term: 'cash',translation: 'наличные',definition: 'money in coins or notes',example: 'Do you have any cash?',part_of_speech: 'noun',level: 'A2',tags: ['shopping'] },
  { term: 'card',translation: 'карта (банковская)',definition: 'a plastic thing used to pay',example: 'I paid with my card.',part_of_speech: 'noun',level: 'A2',tags: ['shopping'] },
  { term: 'travel',translation: 'путешествовать',definition: 'to go from place to place',example: 'We love to travel abroad.',part_of_speech: 'verb',level: 'A2',tags: ['travel', 'verbs'] },
  { term: 'arrive',translation: 'прибывать',definition: 'to reach a place',example: 'The train arrives at noon.',part_of_speech: 'verb',level: 'A2',tags: ['travel', 'verbs'] },
  { term: 'leave',translation: 'уезжать, покидать',definition: 'to go away from a place',example: 'We leave for Rome tomorrow.',part_of_speech: 'verb',level: 'A2',tags: ['travel', 'verbs'] },
  { term: 'wait',translation: 'ждать',definition: 'to stay until something happens',example: 'Wait for me at the entrance.',part_of_speech: 'verb',level: 'A2',tags: ['daily', 'verbs'] },
  { term: 'stop',translation: 'останавливаться',definition: 'to no longer move',example: 'The bus stops here.',part_of_speech: 'verb',level: 'A2',tags: ['travel', 'verbs'] },
  { term: 'week',translation: 'неделя',definition: 'seven days',example: 'I go swimming twice a week.',part_of_speech: 'noun',level: 'A1',tags: ['time'] },
  { term: 'month',translation: 'месяц',definition: 'one of the twelve parts of a year',example: 'The rent is paid every month.',part_of_speech: 'noun',level: 'A1',tags: ['time'] },
  { term: 'year',translation: 'год',definition: 'twelve months',example: 'We moved here last year.',part_of_speech: 'noun',level: 'A1',tags: ['time'] },
  { term: 'weather',translation: 'погода',definition: 'the state of the sky and air',example: 'The weather is sunny today.',part_of_speech: 'noun',level: 'A2',tags: ['daily'] },
  { term: 'rain',translation: 'дождь',definition: 'water falling from the sky',example: 'Take an umbrella; it may rain.',part_of_speech: 'noun/verb',level: 'A2',tags: ['weather'] },
  { term: 'sunny',translation: 'солнечный',definition: 'with bright sunshine',example: 'It is warm and sunny.',part_of_speech: 'adjective',level: 'A2',tags: ['weather'] },
  { term: 'cold',translation: 'холодный',definition: 'having a low temperature',example: 'It is very cold in winter.',part_of_speech: 'adjective',level: 'A1',tags: ['weather'] },
  { term: 'hot',translation: 'горячий, жаркий',definition: 'having a high temperature',example: 'The soup is very hot.',part_of_speech: 'adjective',level: 'A1',tags: ['weather', 'describing'] },
];

function seedWords(db) {
  const insertWord = db.prepare(
    'INSERT INTO words (term, translation, definition, example, part_of_speech, level, tags) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const seedTransaction = db.transaction(() => {
    for (const w of WORDS) {
      insertWord.run(w.term, w.translation, w.definition, w.example, w.part_of_speech, w.level, JSON.stringify(w.tags));
    }
  });
  seedTransaction();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dbPath = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'app.db');
  const db = openDb(dbPath);
  const result = seed(db);
  db.close();
  console.log(result.skipped ? 'Seed skipped (DB non-empty)' : 'Seed complete');
}