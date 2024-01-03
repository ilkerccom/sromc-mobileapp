// string json to json obj
export function jsonConvert(json) {
    let _json = json;
    _json = _json.replace(/([a-zA-Z])'([a-zA-Z])/g, '$1’$2');
    _json = _json.replace(/'/g, '"');
    _json = _json.replace(/False,/g, 'false,');
    _json = _json.replace(/True,/g, 'true,');
    return JSON.parse(_json);
}

// dynamic keys
export function normalizeJson(str, onlyReplaceNone = false) {
    str = str.replace(/None/g, '{ "model": 0, "name": "" }');
    if (onlyReplaceNone) {
        return str;
    }

    str = str.replace(/(['"])?([a-zA-Z0-9_]+)(['"])([0-9])?:([^\/])/g, '"$2":$4');
    str = str.replace(/([0-9]+):([^\/])/g, '"$1":$2');
    return str;
    //return str.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:([^\/])/g, '"$2":$4');
}

// replace message
export function replaceMessage(msg) {
    return msg.replace(/\\x/g, '');
}

// edit messages
export function messageResolver(msg, type) {
    let _msg = msg;

    if (type == 'union') {
        _msg = _msg.substring(1);
        _msg = "(" + _msg.replace(')', ': ')
    }

    _msg = _msg.replace(/%40/g, '@');
    _msg = _msg.replace(/%23/g, '#');
    _msg = _msg.replace(/%3F/g, '?');
    _msg = _msg.replace(/%26/g, '&');
    _msg = _msg.replace(/%3D/g, '');
    _msg = _msg.replace(/%2B/g, '+');
    _msg = _msg.replace(/%2C/g, ',');
    _msg = _msg.replace(/%3A/g, ':');
    _msg = _msg.replace(/%3B/g, ';');
    _msg = _msg.replace(/   /g, ' ');
    _msg = _msg.replace(/  /g, ' ');
    
    return decodeURI(_msg);
}

// char to another pm
export function pmToFromResolver(from) {
    if (from.indexOf('|') > 0) {
        const _from = from.split('|')[0];
        const _to = from.split('|')[1];
        return _to + " (TO)";
    }

    return from;
}

// string to hex for inject opcode 
export function stringToHex(str) {
    var arr = [];
    for (var i = 0; i < str.length; i++) {
        arr[i] = (str.charCodeAt(i).toString(16)).slice(-4);
    }
    return "\\x" + arr.join("\\x");
}

export function yToLat(y) {
    return (y / 192.8) - 45.06;
}

export function LatToY(lat) {
    return (lat + 45.06) * 192.8;
}

export function xToLng(x) {
    return (x / 138.1) + 9.85;
}

export function LngToX(lng) {
    return (lng - 9.85) * 138.1;
}

// HP % calculator
export function calculateHPMPPerc(hp, hp_max) {
    _hp = parseInt(hp);
    _max = parseInt(hp_max);
    _perc = (100 * _hp) / _max;
    return _perc.toFixed(2);
}

// EXP calculator
export function calculateEXP(current, max) {
    _current = parseFloat(current);
    _max = parseFloat(max);
    _perc = (100 * _current) / _max;

    return toFixed(_perc, 2);

}

// character race type
export function raceType(id) {
    const _id = parseInt(id);
    if (_id > 1932)
        return 'EU';
    return 'CH';
}

// Game local
export function gameLocal(id) {
    const _id = parseInt(id);
    if (_id == 56) {
        return "TRSRO";
    }
    else if (_id == 18) {
        return "iSRO";
    }
    else if (_id == 65) {
        return "SilkroadR";
    }
    else if (_id == 22) {
        return "vSRO";
    }
    else if (_id == 23) {
        return "vSRO 2";
    }
    else if (_id == 52) {
        return "cSRO";
    }
    else if (_id == 18) {
        return "cSRO (Private)";
    }
    else if (_id == 9) {
        return "ECSRO";
    }
    else if (_id == 46) {
        return "jSRO";
    }
    else if (_id == 54) {
        return "DIGEAM";
    }
    else {
        return "";
    }
}

// To fixed implenamtio
function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}