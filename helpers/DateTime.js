import moment from 'moment';

class DateTime {

    weeksInYear(year) {
        return Math.max(
                moment(new Date(year, 11, 31)).isoWeek()
            , moment(new Date(year, 11, 31-7)).isoWeek()
        );
    }

}

export default new DateTime();

 