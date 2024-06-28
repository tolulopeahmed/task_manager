$(document).ready(function() {
    function loadTasks(status = '') {
        let url = '/api/tasks/';
        if (status) {
            url += status + '/';
        }
        $.getJSON(url, function(data) {
            let taskList = '';
            $.each(data, function(index, task) {
                taskList += `<div class="task-item p-4 mb-2 border rounded">
                    <h2 class="text-xl">${task.title}</h2>
                    <p>${task.description}</p>
                    <p>Status: ${task.status}</p>
                    <p>Priority: ${task.priority}</p>
                    <p>Due Date: ${task.due_date}</p>
                    <p>Category: ${task.category}</p>
                </div>`;
            });
            $('#task-list').html(taskList);
        });
    }

    loadTasks();

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
