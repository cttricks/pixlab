// Handle FAQ's loading & rendering
const loadFAQ = async () => {
    const response = await fetch('/data/faq.json');
    if (!response.ok) throw new Error(`Unable to fetch FAQ's json from given path!`);

    const content = await response.json();
    let item = 0;

    content.forEach(faq => {
        item++;

        // Make a copy of accordion-template
        const template = $('#accordion-template')[0].content.cloneNode(true);

        // Populate data
        $(template).find('input').prop('id', `accordion-${item}`);
        $(template).find('label').prop('for', `accordion-${item}`);
        $(template).find('label').html(faq.question);
        $(template).find('p').html(faq.answer);

        // Append Item In accordion-group
        $('div.accordion-group').append(template);
    });
}

// Load FAQ's
$(document).ready(loadFAQ);

// Handle theme changes
const changeTheme = (theme) => {

    // Skip if current theme is same as selected
    if ($('html').attr('data-theme-name') === theme) return;
    $('html').attr('data-theme-name', theme);

    switch(theme){
        case 'light':
            $('header div.dropdown label i').prop('class', 'ri-sun-fill');
            break;

        case 'dark':
            $('header div.dropdown label i').prop('class', 'ri-moon-fill');
            break;

        case 'system':
            $('header div.dropdown label i').prop('class', 'ri-computer-fill');
            break;

        default:
            console.log(`Whoops! Undefined theme... feature or bug? 🤔`);
    }

    // theme based on system prefers-color-scheme, if system
    if (theme === 'system') {
        theme = (window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }

    // Apply changes
    $('html').attr('data-theme', theme).attr('style', `color-scheme: ${theme}`);

    // Save current theme
    localStorage.setItem('theme', theme);
}

// Toggle theme
$('header div.dropdown-menu').on('click', (e) => {
    // User clicked on options container
    if (e.target.innerText.trim().length > 6) return;

    // Get selected theme name
    let theme = e.target.innerText.trim().toLowerCase();

    // Change it
    changeTheme(theme);
});

// Auto apply theme on page load
$(document).ready(() => {
    changeTheme((localStorage.getItem('theme')??'light'));
});

// Toastify
const toast = {
    info: (message) => {
        toast.show(message, "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)");
    },

    error: (message)  => {
        toast.show(message, "#e50b60");
    },

    show: (message, background) => {
        Toastify({
            text: message,
            gravity: "bottom",
            position: "left",
            style: { background }
        }).showToast();
    }
}
 