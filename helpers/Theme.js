
class Light {
    backgroundColor = '#ffffff';
    dullTextColor = '#C0C0C0';
    textColor = '#000000';
    buttonHighlightColor = '#ccc';

    pastDayBackgroundColor = '#F5F5F5';
    currentAndFutureDayBackgroundColor = 'white';

    editEvent = {
        backgroundColor: '#7a0000',
        buttonRowBackgroundColor: '#b60000',
    };

    menu = {
        backgroundColor: 'white',
        textColor: '#000000',
    };
}

class Dark {
    backgroundColor = '#262626';
    dullTextColor = '#C0C0C0';
    textColor = '#ffffff';
    buttonHighlightColor = '#ccc';

    pastDayBackgroundColor = '#b0b0b0';
    currentAndFutureDayBackgroundColor = '#c0c0c0';

    editEvent = {
        backgroundColor: '#7a0000',
        buttonRowBackgroundColor: '#b60000',
    };

    menu = {
        backgroundColor: '#000000',
        textColor: '#ffffff',
    };
}

class Theme
{
    constructor() {
        this.setTheme('dark');    
    }

    setTheme(name) {
        switch (name.toLowerCase()) {
        case 'light':
            Object.assign(this, new Light());
            break;

        default:
        case 'dark':
            Object.assign(this, new Dark());
            break;
        }
    }


}

export default new Theme();