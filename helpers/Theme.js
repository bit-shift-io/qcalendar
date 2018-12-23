
class Light {
    backgroundColor = '#ffffff';
    dullTextColor = '#C0C0C0';
    textColor = '#000000';
    buttonHighlightColor = '#ccc';

    pastDayBackgroundColor = '#F5F5F5';
    currentDayBackgroundColor = 'white';
    futureDayBackgroundColor = 'white';

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
    backgroundColor = '#3f3f3f';
    dullTextColor = '#ffffff'; //#C0C0C0';
    textColor = '#ffffff';
    buttonHighlightColor = '#ccc';

    pastDayBackgroundColor = 'transparent';
    currentDayBackgroundColor = '#5a5a5a';
    futureDayBackgroundColor = 'transparent';

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