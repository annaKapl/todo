const { JSDOM } = require('jsdom');

const { window } = new JSDOM();
global.document = window.document;
global.window = window;

const TodoList = require('../todo');

describe('TodoList', () => {
  let todoList;

  beforeEach(() => {
    todoList = new TodoList();
  });

  test('addTask should add a task to the list', () => {
    const title = 'Task 1';
    const date = '2023-06-30';
    const time = '09:00';
    const repetitionType = 'none';
    const repetitionEndDate = '';
    const description = 'Description for Task 1';

    todoList.addTask(title, date, time, repetitionType, repetitionEndDate, description);

    expect(todoList.tasks.length).toBe(1);
    expect(todoList.tasks[0].title).toBe(title);
    expect(todoList.tasks[0].date).toBe(date);
    expect(todoList.tasks[0].time).toBe(time);
    expect(todoList.tasks[0].repetitionType).toBe(repetitionType);
    expect(todoList.tasks[0].repetitionEndDate).toBe(repetitionEndDate);
    expect(todoList.tasks[0].description).toBe(description);
  });

  test('deleteTask should remove a task from the list', () => {
    // Add a task
    const title = 'Task 1';
    const date = '2023-06-30';
    const time = '09:00';
    const repetitionType = 'none';
    const repetitionEndDate = '';
    const description = 'Description for Task 1';

    todoList.addTask(title, date, time, repetitionType, repetitionEndDate, description);

    expect(todoList.tasks.length).toBe(1);

    // Delete the task
    const taskId = todoList.tasks[0].id;
    todoList.deleteTask(taskId);

    expect(todoList.tasks.length).toBe(0);
  });

  test('editTask should update the details of a task', () => {
    // Add a task
    const title = 'Task 1';
    const date = '2023-06-30';
    const time = '09:00';
    const repetitionType = 'none';
    const repetitionEndDate = '';
    const description = 'Description for Task 1';
  
    todoList.addTask(title, date, time, repetitionType, repetitionEndDate, description);
  
    // Edit the task
    const taskId = todoList.tasks[0].id;
    const newTitle = 'Updated Task 1';
    const newDate = '2023-07-01';
    const newTime = '10:00';
    const newDescription = 'Updated description for Task 1';
    todoList.editTask(taskId, newTitle, newDate, newTime, newDescription);
  
    // Verify the updated task details
    const editedTask = todoList.tasks.find((task) => task.id === taskId);
    expect(editedTask.title).toBe(newTitle);
    expect(editedTask.date).toBe(newDate);
    expect(editedTask.time).toBe(newTime);
    expect(editedTask.description).toBe(newDescription);
  });
  test('completeTask should mark a task as completed', () => {
    // Add a task
    const title = 'Task 1';
    const date = '2023-06-30';
    const time = '09:00';
    const repetitionType = 'none';
    const repetitionEndDate = '';
    const description = 'Description for Task 1';

    todoList.addTask(title, date, time, repetitionType, repetitionEndDate, description);

    expect(todoList.tasks.length).toBe(1);
    expect(todoList.tasks[0].completed).toBeUndefined();

    // Complete the task
    const taskId = todoList.tasks[0].id;
    todoList.completeTask(taskId);

    expect(todoList.tasks[0].completed).toBe(true);
  });

  test('sortTasks should sort tasks by date and time', () => {
    // Add tasks with different dates and times
    const task1 = {
      id: 1,
      title: 'Task 1',
      date: '2023-06-30',
      time: '09:00',
      repetitionType: 'none',
      repetitionEndDate: '',
      description: 'Description for Task 1',
    };

    const task2 = {
      id: 2,
      title: 'Task 2',
      date: '2023-07-01',
      time: '10:00',
      repetitionType: 'none',
      repetitionEndDate: '',
      description: 'Description for Task 2',
    };

    const task3 = {
      id: 3,
      title: 'Task 3',
      date: '2023-06-29',
      time: '08:00',
      repetitionType: 'none',
      repetitionEndDate: '',
      description: 'Description for Task 3',
    };

    todoList.tasks.push(task1, task2, task3);

    // Sort the tasks
    todoList.sortTasks();

    // Verify the order of tasks
    expect(todoList.tasks[0].id).toBe(task3.id);
    expect(todoList.tasks[1].id).toBe(task1.id);
    expect(todoList.tasks[2].id).toBe(task2.id);
  });

  
  test('scheduleRepetitions should schedule repeated tasks based on repetition type and end date', () => {
    // Add a task with repetition
    const title = 'Task 1';
    const date = '2023-06-30';
    const time = '09:00';
    const repetitionType = 'daily';
    const repetitionEndDate = '2023-07-04';
    const description = 'Description for Task 1';
  
    todoList.addTask(title, date, time, repetitionType, repetitionEndDate, description);
  
    // Verify the number of tasks after scheduling repetitions
    console.log('Number of tasks:', todoList.tasks.length);
    expect(todoList.tasks.length).toBe(5); // 1 initial task + 4 repeated tasks
  
    // Verify the dates of the repeated tasks
    const taskDates = todoList.tasks.map((task) => task.date);
    console.log('Task dates:', taskDates);
    // Add your assertions for task dates here
  });
});

