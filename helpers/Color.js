 



/*
 Mix colour_1 with colour_2 and weight from 0->1
*/
function mix(color_1, color_2, weight) {
    function d2h(d) { return d.toString(16); }  // convert a decimal value to hex
    function h2d(h) { return parseInt(h, 16); } // convert a hex value to decimal 

    color_1 = color_1.replace(/#/g , '');
    color_2 = color_2.replace(/#/g , '');

    weight = (typeof(weight) !== 'undefined') ? (weight * 100) : 50; // set the weight to 50%, if that argument is omitted

    var color = "#";

    for(var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
        var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
            v2 = h2d(color_2.substr(i, 2)),
            
            // combine the current pairs from each source color, according to the specified weight
            val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0))); 

        while(val.length < 2) { val = '0' + val; } // prepend a '0' if val results in a single digit
        
        color += val; // concatenate val to our new color string
    }
        
    return color; // PROFIT!
};


function rgb2hex(rgb) {
    // A very ugly regex that parses a string such as 'rgb(191, 0, 46)' and produces an array
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d\.]+))?\)$/);
  
    function hex(x) { return ("0" + parseInt(x).toString(16)).slice(-2); } // another way to convert a decimal to hex
    
    return (hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase(); // concatenate the pairs and return them upper cased
};

export default {
    mix,
    rgb2hex,
};