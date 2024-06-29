$(document).ready(function() {
    function loadTasks(status = '') {
        let url = '/api/tasks/';
        if (status) {
            url += status + '/';
        }
        $.getJSON(url, function(data) {
            console.log('Data received for', status, data);
            let taskList = '';
            $.each(data, function(index, task) {
                const taskHtml = `
                    <div class="task-item mt-1 rounded-lg">
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
                            <button class="flex items-center border border-gray-300 rounded px-2 py-1 mt-4">
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
                                    <i class="far fa-eye text-purple-700"></i>
                                    <i class="fas fa-trash text-purple-700"></i>
                                    <i class="fas fa-edit text-purple-700"></i>
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
        return str.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
    }

    loadTasks('in_progress');
    loadTasks('completed');
    loadTasks('overdue');

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
                $('#taskTitle').val('');
                $('#taskDescription').val('');
                $('#taskStatus').val('in_progress');
                $('#taskPriority').val('low');
                $('#taskDueDate').val('');
                $('#taskCategory').val('UX Design');
                $('#taskAssignedTo').val('');
                loadTasks('in_progress');
                loadTasks('completed');
                loadTasks('overdue');
                $('#addTaskModal').addClass('hidden');
            },
            error: function(xhr) {
                console.error(xhr.responseText);
            }
        });
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
});
