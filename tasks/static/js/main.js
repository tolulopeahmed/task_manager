function toggleSidebar() {
    const sidebar = $('#sidebar');
    const sidebarContent = $('#sidebarContent');
    const upgradeContainer = $('#upgradeContainer');
    const taskyContainer = $('#taskyContainer');
    const toggleIcon = $('#toggleIcon');

    if (sidebar.hasClass('w-64')) {
        sidebar.removeClass('w-64').addClass('w-16');
        sidebarContent.hide();
        upgradeContainer.hide();
        taskyContainer.hide();
        toggleIcon.removeClass('fa-bars').addClass('fa-arrow-circle-right');
    } else {
        sidebar.removeClass('w-16').addClass('w-64');
        sidebarContent.show();
        upgradeContainer.show();
        taskyContainer.show();
        toggleIcon.removeClass('fa-arrow-circle-right').addClass('fa-bars');
    }
}

$('#toggleSidebarBtn').on('click', toggleSidebar);

function checkSidebarState() {
    const sidebar = $('#sidebar');
    const sidebarContent = $('#sidebarContent');
    const upgradeContainer = $('#upgradeContainer');
    const taskyContainer = $('#taskyContainer');
    const toggleIcon = $('#toggleIcon');

    if ($(window).width() <= 940) {
        sidebar.removeClass('w-64').addClass('w-16');
        sidebarContent.hide();
        upgradeContainer.hide();
        taskyContainer.hide();
        toggleIcon.removeClass('fa-bars').addClass('fa-arrow-circle-right');
    } else {
        sidebar.removeClass('w-16').addClass('w-64');
        sidebarContent.show();
        upgradeContainer.show();
        taskyContainer.show();
        toggleIcon.removeClass('fa-arrow-circle-right').addClass('fa-bars');
    }
}

$(window).on('resize', checkSidebarState).trigger('resize');





$(document).ready(function() {
    // Load tasks function
    function loadTasks(status = '', sortField = '') {
        let url = '/api/tasks/';
        if (status) {
            url += status + '/';
        }

        let params = [];
        if (sortField) {
            params.push('ordering=' + sortField);
        }

        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        $.getJSON(url, function(data) {
            let taskList = '';
            $.each(data, function(index, task) {
                const taskHtml = `
                    <div class="task-item mt-1 rounded-lg" data-id="${task.id}" data-status="${task.status}" draggable="true" ondragstart="drag(event)" data-priority="${task.priority}" data-category="${task.category}">
                        <div class="flex mt-6 space-x-4">
                            <button class="text-black text-center text-xs font-bold" style="background-color: ${getPriorityColor(task.priority)}; padding: 0.5rem 1rem; border-radius: 0.25rem;">
                                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </button>
                            <button class="bg-white text-center text-xs font-bold shadow px-2 py-1 rounded flex items-center">
                                <i class="far fa-clock text-purple-700 mr-1 font-bold"></i>
                                <span class="text-purple-700 font-bold">${new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </button>
                            <button class="text-purple-700 text-center font-bold text-xs" style="background-color: #EBE4FF; padding: 0.5rem 1rem; border-radius: 0.25rem;">
                                ${task.category}
                            </button>
                        </div>
                        <div class="p-4 mt-3 rounded-lg" style="background-color: #E8E8E8;">
                            <div class="flex justify-between items-center">
                                <span class="font-bold text-black">${task.title}</span>
                                <i class="fas fa-ellipsis-v text-gray-400"></i>
                            </div>
                            <p class="mt-2 text-gray-500 text-sm">${task.description}</p>
                            <button class="flex items-center border border-gray-300 rounded px-2 py-1 mt-4 mb-4">
                                <i class="fas fa-tasks mr-1 text-gray-400 text-sm"></i>
                                <span class="text-gray-400 text-sm">0/3</span>
                            </button>
                            <div class="flex justify-between items-center mt-2">
                                <div class="flex -space-x-2">
                                    <img src="${imageUrls.bukola}" alt="Profile" class="w-6 h-6 rounded-full border border-gray-100">
                                    <img src="${imageUrls.drtsquare}" alt="Profile" class="w-6 h-6 rounded-full border border-gray-100">
                                    <img src="${imageUrls.segun}" alt="Profile" class="w-6 h-6 rounded-full border border-gray-100">
                                    <div class="w-6 h-6 rounded-full bg-purple-700 flex items-center justify-center border border-gray-100">
                                        <span class="text-white text-xs">+2</span>
                                    </div>
                                </div>
                                <div class="flex space-x-4">
                                    <i class="far fa-eye text-gray-700 viewTaskButton" data-task-id="${task.id}"></i>
                                    <i class="fas fa-trash text-gray-700 deleteTaskButton" data-task-id="${task.id}"></i>
                                    <i class="fas fa-edit text-gray-700 editTaskButton" data-task-id="${task.id}"></i>
                                </div>
                            </div>
                        </div>
                    </div>`;
                taskList += taskHtml;
            });
            if (status) {
                $('#' + camelCase(status) + 'TaskList').html(taskList);
                $('#' + camelCase(status) + 'Count').text(`(${data.length})`);
            }
        });
    }

    function getPriorityColor(priority) {
        switch (priority) {
            case 'high':
                return '#F4D0D0';
            case 'medium':
                return '#FFE4B5';
            case 'low':
                return '#D0F4D0';
            default:
                return '#E8E8E8';
        }
    }

    function camelCase(str) {
        return str.replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
    }

    loadTasks('inprogress');
    loadTasks('completed');
    loadTasks('overdue');

    // Drag-and-drop functions
    window.allowDrop = function(event) {
        event.preventDefault();
    }

    window.drag = function(event) {
        event.dataTransfer.setData("text", event.target.dataset.id);
    }

    window.drop = function(event) {
        event.preventDefault();
        const taskId = event.dataTransfer.getData("text");
        const newStatus = event.target.id.replace('Tasks', '').toLowerCase();
    
        // Ensure newStatus is not empty before sending
        if (newStatus) {
            $.ajax({
                url: '/api/tasks/' + taskId + '/',
                method: 'PATCH',
                data: JSON.stringify({ status: newStatus }),
                contentType: 'application/json',
                success: function(data) {
                    loadTasks('inprogress');
                    loadTasks('completed');
                    loadTasks('overdue');
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.error(xhr.responseText);
                }
            });
        }
    }

    // Event listener for sort select
    $('#sortSelect').on('change', function() {
        const sortField = $(this).val();
        loadTasks('', sortField);
    });

    // Event listener for filter select
    $('#filterSelect').on('change', function() {
        const filterValue = $(this).val().toLowerCase();
        $('.task-item').each(function() {
            const taskPriority = $(this).data('priority').toLowerCase();
            const taskCategory = $(this).data('category').toLowerCase();
            if (taskPriority.includes(filterValue) || taskCategory.includes(filterValue)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    $('#addTaskButton').click(function() {
        $('#addTaskModal').removeClass('hidden');
    });

    $('#closeModalButton').click(function() {
        $('#addTaskModal').addClass('hidden');
    });



    $('#searchTasks').on('input', function() {
        const searchText = $(this).val().toLowerCase();
        $('.task-item').each(function() {
            const taskText = $(this).text().toLowerCase();
            if (taskText.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });


    // Open the edit task modal
    $(document).on('click', '.editTaskButton', function() {
        const taskId = $(this).data('task-id');
        $.get('/api/tasks/' + taskId + '/', function(task) {
            $('#editTaskTitle').val(task.title);
            $('#editTaskDescription').val(task.description);
            $('#editTaskStatus').val(task.status);
            $('#editTaskPriority').val(task.priority);
            $('#editTaskDueDate').val(task.due_date);
            $('#editTaskCategory').val(task.category);
            $('#editTaskAssignedTo').val(task.assigned_to);
            $('#saveEditTaskButton').data('task-id', taskId);
            $('#editTaskModal').removeClass('hidden');
        });
    });

        // Save the edited task
        $('#saveEditTaskButton').on('click', function() {
            const taskId = $(this).data('task-id');
            const editedTask = {
                title: $('#editTaskTitle').val(),
                description: $('#editTaskDescription').val(),
                status: $('#editTaskStatus').val(),
                priority: $('#editTaskPriority').val(),
                due_date: $('#editTaskDueDate').val(),
                category: $('#editTaskCategory').val(),
                assigned_to: $('#editTaskAssignedTo').val()
            };

            // Front-end validation
            const errors = {};
            if (!editedTask.title.trim()) {
                errors.title = 'Title cannot be blank.';
            }
            if (!editedTask.description.trim()) {
                errors.description = 'Description cannot be blank.';
            }
            if (!editedTask.status) {
                errors.status = 'Status cannot be blank.';
            }
            if (!editedTask.priority) {
                errors.priority = 'Priority cannot be blank.';
            }
            if (!editedTask.due_date) {
                errors.due_date = 'Due date cannot be blank.';
            }
            if (!editedTask.category) {
                errors.category = 'Category cannot be blank.';
            }
            if (!editedTask.assigned_to.trim()) {
                errors.assigned_to = 'Assigned to cannot be blank.';
            }

            if (Object.keys(errors).length > 0) {
                displayFormErrors(errors); // Function to display errors
                return; // Prevent further processing
            }

            $.ajax({
                url: '/api/tasks/' + taskId + '/',
                method: 'PUT',
                data: JSON.stringify(editedTask),
                contentType: 'application/json',
                success: function(data) {
                    $('#editTaskModal').addClass('hidden');
                    loadTasks('inprogress');
                    loadTasks('completed');
                    loadTasks('overdue');
                },
                error: function(xhr) {
                    const responseErrors = xhr.responseJSON;
                    if (responseErrors) {
                        displayFormErrors(responseErrors);
                    } else {
                        console.error(xhr.responseText);
                    }
                }
            });
        });

        // Function to display errors
        function displayFormErrors(errors) {
            $('#editTaskFormErrors').html(''); // Clear previous errors
            for (const [key, message] of Object.entries(errors)) {
                const errorElement = $('<div></div>').text(message).addClass('text-red-500');
                $('#editTaskFormErrors').append(errorElement);
            }
        }




// Add task event listeners
$('#addTaskButton').click(function() {
    $('#addTaskModal').removeClass('hidden');
});

$('#closeModalButton').click(function() {
    $('#addTaskModal').addClass('hidden');
});

$('#saveTaskButton').on('click', function() {
    const newTask = {
        title: $('#taskTitle').val(),
        description: $('#taskDescription').val(),
        status: $('#taskStatus').val(),
        priority: $('#taskPriority').val(),
        due_date: $('#taskDueDate').val(),
        category: $('#taskCategory').val(),
        assigned_to: $('#taskAssignedTo').val()
    };

    $.ajax({
        url: '/api/tasks/',
        method: 'POST',
        data: JSON.stringify(newTask),
        contentType: 'application/json',
        success: function(data) {
            // Clear form fields
            $('#taskTitle').val('');
            $('#taskDescription').val('');
            $('#taskStatus').val('inprogress');
            $('#taskPriority').val('low');
            $('#taskDueDate').val('');
            $('#taskCategory').val('UX Design');
            $('#taskAssignedTo').val('');
            $('#addTaskModal').addClass('hidden');
            loadTasks('inprogress');
            loadTasks('completed');
            loadTasks('overdue');
        },
        error: function(xhr) {
            // Clear previous error messages
            $('#taskTitleError').text('');
            $('#taskDescriptionError').text('');
            $('#taskStatusError').text('');
            $('#taskPriorityError').text('');
            $('#taskDueDateError').text('');
            $('#taskCategoryError').text('');
            $('#taskAssignedToError').text('');

            // Display error messages
            const errors = xhr.responseJSON;
            if (errors.title) {
                $('#taskTitleError').text(errors.title.join(', '));
            }
            if (errors.description) {
                $('#taskDescriptionError').text(errors.description.join(', '));
            }
            if (errors.status) {
                $('#taskStatusError').text(errors.status.join(', '));
            }
            if (errors.priority) {
                $('#taskPriorityError').text(errors.priority.join(', '));
            }
            if (errors.due_date) {
                $('#taskDueDateError').text(errors.due_date.join(', '));
            }
            if (errors.category) {
                $('#taskCategoryError').text(errors.category.join(', '));
            }
            if (errors.assigned_to) {
                $('#taskAssignedToError').text(errors.assigned_to.join(', '));
            }
        }
    });
});




    // Delete a task
    $(document).on('click', '.deleteTaskButton', function() {
        const taskId = $(this).data('task-id');
        $('#confirmDeleteButton').data('task-id', taskId);
        $('#deleteTaskModal').removeClass('hidden');
    });

    $('#confirmDeleteButton').on('click', function() {
        const taskId = $(this).data('task-id');
        $.ajax({
            url: '/api/tasks/' + taskId + '/',
            method: 'DELETE',
            success: function(data) {
                $('#deleteTaskModal').addClass('hidden');
                loadTasks('inprogress');
                loadTasks('completed');
                loadTasks('overdue');
            }
        });
    });

    $('#cancelDeleteButton').on('click', function() {
        $('#deleteTaskModal').addClass('hidden');
    });

    // View task details
    $(document).on('click', '.viewTaskButton', function() {
        const taskId = $(this).data('task-id');
        $.get('/api/tasks/' + taskId + '/', function(task) {
            $('#viewTaskTitle').text(task.title);
            $('#viewTaskDescription').text(task.description);
            $('#viewTaskStatus').text(task.status);
            $('#viewTaskPriority').text(task.priority);
            $('#viewTaskDueDate').text(new Date(task.due_date).toLocaleDateString());
            $('#viewTaskCategory').text(task.category);
            $('#viewTaskAssignedTo').text(task.assigned_to);
            $('#viewTaskModal').removeClass('hidden');
        });
    });

     // Close modals
    $('#closeEditModalButton, #cancelEditButton').on('click', function() {
        $('#editTaskModal').addClass('hidden');
    });

    $('#closeDeleteModalButton, #cancelDeleteButton').on('click', function() {
        $('#deleteTaskModal').addClass('hidden');
    });

    $('#closeViewModalButton').on('click', function() {
        $('#viewTaskModal').addClass('hidden');
    });



    

document.addEventListener('DOMContentLoaded', function() {
    const inputFields = document.querySelectorAll('.inputField');

    inputFields.forEach(field => {
        field.addEventListener('input', function() {
            if (field.checkValidity()) {
                field.classList.remove('invalid');
                field.classList.add('valid');
            } else {
                field.classList.remove('valid');
                field.classList.add('invalid');
            }
        });
    });

    document.getElementById('saveTaskButton').addEventListener('click', function() {
        let formIsValid = true;
        inputFields.forEach(field => {
            if (!field.checkValidity()) {
                formIsValid = false;
                field.classList.add('invalid');
            } else {
                field.classList.remove('invalid');
                field.classList.add('valid');
            }
        });

        if (formIsValid) {
            // Proceed with form submission logic here
            const newTask = {
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDescription').value,
                status: document.getElementById('taskStatus').value,
                priority: document.getElementById('taskPriority').value,
                due_date: document.getElementById('taskDueDate').value,
                category: document.getElementById('taskCategory').value,
                assigned_to: document.getElementById('taskAssignedTo').value
            };

            $.ajax({
                url: '/api/tasks/',
                method: 'POST',
                data: JSON.stringify(newTask),
                contentType: 'application/json',
                success: function(data) {
                    // Clear the form fields
                    inputFields.forEach(field => field.value = '');
                    inputFields.forEach(field => field.classList.remove('valid'));
                    inputFields.forEach(field => field.classList.remove('invalid'));
                    document.getElementById('addTaskModal').classList.add('hidden');
                    loadTasks(); // Reload tasks
                }
            });
        }
    });
});

});
