class TodoList {
  constructor() {
    this.tasks = [];
    this.nextTaskId = 1;
    this.timer = null;

    document.addEventListener('DOMContentLoaded', () => {
      const todoList = new TodoList();


      this.renderTasks();
      this.startTimer();
    });
  }

  showNotification(message) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeIcon = document.createElement('span');
    closeIcon.classList.add('modal-close');
    closeIcon.innerText = 'null';

    const notificationText = document.createElement('h3');
    notificationText.innerText = message;

    modalContent.appendChild(closeIcon);
    modalContent.appendChild(notificationText);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    closeIcon.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }

  playNotificationSound() {
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      const audio = new Audio('/121.mp3');
      audio.play();
    } else {
      console.log('Notification sound playback not supported in this environment.');
    }
  }
  addTask(title, date, time, repetitionType, repetitionEndDate, description) {
    const task = {
      id: this.nextTaskId++,
      title,
      date,
      time,
      repetitionType,
      repetitionEndDate,
      description,
    };

    this.tasks.push(task);
    this.sortTasks();
    this.renderTasks();

    this.clearInputFields();
    this.showNotification('Task added successfully!');
    this.playNotificationSound();

    if (repetitionType !== 'none') {
      this.scheduleRepetitions(task);
    }
    
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.renderTasks();
  }

  editTask(taskId, newTitle, newDate, newTime, newDescription) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      // Update task details
      task.title = newTitle;
      task.date = newDate;
      task.time = newTime;
      task.description = newDescription;
  
      this.sortTasks();
      this.renderTasks();
    }
  }

  completeTask(taskId) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.completed = true;
      this.renderTasks();

      // Show a notification for completed tasks
      this.showNotification(`Task "${task.title}" completed!`);
      this.playNotificationSound();
    }
  }

  

  sortTasks() {
    this.tasks.sort((taskA, taskB) => {
      const dateA = new Date(`${taskA.date}T${taskA.time}`);
      const dateB = new Date(`${taskB.date}T${taskB.time}`);
      return dateA - dateB;
    });
  }
  renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;
  
    taskList.innerHTML = "";

    this.tasks.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("task");

      const titleElement = document.createElement("h3");
      titleElement.classList.add("task-title");
      titleElement.innerText = task.title;

      const infoElement = document.createElement("p");
      infoElement.classList.add("task-info");
      infoElement.innerText = `Дата: ${task.date}, Время: ${task.time}`;

      const descriptionElement = document.createElement("p");
      descriptionElement.innerText = task.description;

      const editButton = document.createElement("button");
      editButton.innerText = "Изменить";
      editButton.addEventListener("click", () => {
        this.editTask(task.id);
      });

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Удалить";
      deleteButton.addEventListener("click", () => {
        this.deleteTask(task.id);
      });

      const completeButton = document.createElement("button");
      completeButton.innerText = "Выполнено";
      completeButton.addEventListener("click", () => {
        this.completeTask(task.id);
      });

      taskElement.appendChild(titleElement);
      taskElement.appendChild(infoElement);
      taskElement.appendChild(descriptionElement);
      taskElement.appendChild(editButton);
      taskElement.appendChild(deleteButton);
      taskElement.appendChild(completeButton);

      taskList.appendChild(taskElement);
    });
  }

  clearInputFields() {
    const titleInput = document.getElementById('titleInput');
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');
    const repetitionEndDateInput = document.getElementById('repetitionEndDateInput');
  
    if (titleInput) {
      titleInput.value = '';
    }
    if (dateInput) {
      dateInput.value = '';
    }
    if (timeInput) {
      timeInput.value = '';
    }
    if (repetitionEndDateInput) {
      repetitionEndDateInput.value = '';
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      });
      document.getElementById('currentTime').innerText = currentTime;
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  scheduleRepetitions(task) {
    const { repetitionType, repetitionEndDate } = task;

    if (repetitionType === 'daily') {
      const endDate = new Date(repetitionEndDate);
      let currentDate = new Date(`${task.date}T${task.time}`);

      while (currentDate <= endDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        const repeatedTask = {
          ...task,
          id: this.nextTaskId++,
          date: currentDate.toISOString().split('T')[0],
        };
        this.tasks.push(repeatedTask);
        currentDate = new Date(`${repeatedTask.date}T${repeatedTask.time}`);
      }
    } else if (repetitionType === 'weekly') {
      const endDate = new Date(repetitionEndDate);
      const selectedWeekday = new Date(`${task.date}T${task.time}`).getDay();

      let currentDate = new Date(`${task.date}T${task.time}`);

      while (currentDate <= endDate) {
        currentDate.setDate(currentDate.getDate() + 1);

        if (currentDate.getDay() === selectedWeekday) {
          const repeatedTask = {
            ...task,
            id: this.nextTaskId++,
            date: currentDate.toISOString().split('T')[0],
          };
          this.tasks.push(repeatedTask);
        }
      }
    } else if (repetitionType === 'weekdays') {
      const endDate = new Date(repetitionEndDate);
      let currentDate = new Date(`${task.date}T${task.time}`);

      while (currentDate <= endDate) {
        currentDate.setDate(currentDate.getDate() + 1);

        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          const repeatedTask = {
            ...task,
            id: this.nextTaskId++,
            date: currentDate.toISOString().split('T')[0],
          };
          this.tasks.push(repeatedTask);
        }
      }
    } else if (repetitionType === 'weekends') {
      const endDate = new Date(repetitionEndDate);
      let currentDate = new Date(`${task.date}T${task.time}`);

      while (currentDate <= endDate) {
        currentDate.setDate(currentDate.getDate() + 1);

        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          const repeatedTask = {
            ...task,
            id: this.nextTaskId++,
            date: currentDate.toISOString().split('T')[0],
          };
          this.tasks.push(repeatedTask);
        }
      }
    } else if (repetitionType === 'every-2-weeks') {
      const endDate = new Date(repetitionEndDate);
      let currentDate = new Date(`${task.date}T${task.time}`);

      while (currentDate <= endDate) {
        currentDate.setDate(currentDate.getDate() + 14);
        const repeatedTask = {
          ...task,
          id: this.nextTaskId++,
          date: currentDate.toISOString().split('T')[0],
        };
        this.tasks.push(repeatedTask);
      }
    } else if (repetitionType === 'every-3-months') {
      const endDate = new Date(repetitionEndDate);
      let currentDate = new Date(`${task.date}T${task.time}`);

      while (currentDate <= endDate) {
        currentDate.setMonth(currentDate.getMonth() + 3);
        const repeatedTask = {
          ...task,
          id: this.nextTaskId++,
          date: currentDate.toISOString().split('T')[0],
        };
        this.tasks.push(repeatedTask);
      }
    } else if (repetitionType === 'monthly') {
      const endDate = new Date(repetitionEndDate);
      let currentDate = new Date(`${task.date}T${task.time}`);

      while (currentDate <= endDate) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        const repeatedTask = {
          ...task,
          id: this.nextTaskId++,
          date: currentDate.toISOString().split('T')[0],
        };
        this.tasks.push(repeatedTask);
      }
    } else if (repetitionType === 'yearly') {
      const endDate = new Date(repetitionEndDate);
      let currentDate = new Date(`${task.date}T${task.time}`);

      while (currentDate <= endDate) {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        const repeatedTask = {
          ...task,
          id: this.nextTaskId++,
          date: currentDate.toISOString().split('T')[0],
        };
        this.tasks.push(repeatedTask);
      }
    }

    this.sortTasks();
    this.renderTasks();
  }
}

module.exports = TodoList;