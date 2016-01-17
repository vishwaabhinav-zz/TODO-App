(function() {
    document.querySelector('#add_tasks').addEventListener('click', _addTaskListener);

    document.querySelector('.done_tasks_container').addEventListener('drop', _handleTaskDrop);

    var _tasks = JSON.parse(localStorage.getItem('todo_tasks')) || {};
    var _id = Math.max(Object.keys(_tasks)) || 0;

    var color = ['#FF7FBF', '#79F4B6', '#F66969', '#9292FF', '#FF9494'];

    function _getRandomColor() {
    	return color[Math.floor(Math.random() * 4)];
    }

    function _handleTaskDrop(e) {
    	var taskData = JSON.parse(e.dataTransfer.getData('text/plain'));
    	_tasks[taskData.id].done = true;
    	_refreshTasks();
    }

    function _refreshTasks() {
    	document.querySelector('.due_tasks_container').innerHTML = '';
    	document.querySelector('.done_tasks_container').innerHTML = '';
        Object.keys(_tasks).map(function(key) {
            _addTask(key, _tasks[key], false);
        });

        localStorage.setItem('todo_tasks', JSON.stringify(_tasks));
    }

    function _addTaskListener() {
        var taskStr = document.getElementById('task_input').value;
        if (taskStr) {
        	var conf = {
        		'content': taskStr,
        		'done': false
        	}
            _addTask(++_id, conf, true);
        }
    }

    function _addTask(id, conf, updateTaskList) {
        var taskObj = document.createElement('x-task');
        taskObj.content = conf.content;

        taskObj.setAttribute('data-id', id);

        taskObj.addEventListener('closed', _handleTaskDeletion);

        taskObj.addEventListener('dragstart', _handleDragStart);

        taskObj.addEventListener('dragend', _handleDragEnd);
        _getAvailableRow(conf.done).appendChild(taskObj);

        if(conf.done) {
        	taskObj.setAttribute('done', '');
        	taskObj.removeAttribute('draggable');
        }
        else {
        	conf.bgcolor = conf.bgcolor || _getRandomColor()
        	taskObj.bgcolor = conf.bgcolor;
        }
        if (updateTaskList) {
            _tasks[id] = conf;
            _refreshTasks();
        }
    }

    function _handleDragEnd(e) {
    	console.log(e.target);
    }

    function _handleDragStart(e) {
    	e.dataTransfer.setData('text/plain', JSON.stringify({
    		'content': this.content,
    		'id': this.getAttribute('data-id')
    	}));
    }

    function _handleTaskDeletion() {
        if (this.parentNode.childElementCount === 1) {
            this.parentNode.parentNode.removeChild(this.parentNode);
        } else {
            this.parentNode.removeChild(this);
        }

        delete _tasks[this.getAttribute('data-id')];
        localStorage.setItem('todo_tasks', JSON.stringify(_tasks));

        _refreshTasks();
    }

    function _getAvailableRow(done) {
        var lastRow = document.createElement('div');
        lastRow.classList.add('row');

    	if(done) {
    		document.querySelector('.done_tasks_container').appendChild(lastRow);
    	}
    	else {
    		var availableRow = document.querySelector('.due_tasks_container .row:last-child');
    		if(availableRow && availableRow.childElementCount < 2) {
    			return availableRow;
    		}
    		document.querySelector('.due_tasks_container').appendChild(lastRow);
    	}
        return lastRow;
    }

    _refreshTasks();
})();
