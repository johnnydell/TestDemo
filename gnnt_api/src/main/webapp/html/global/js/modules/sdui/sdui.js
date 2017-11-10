/**
 * 定义sdui基本工具类
 *
 * @author wangbinbin
 * @date 2016/11/28
 *
 */
var sdutil = {
    trim: function (str) {
        return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
    }
    , removeItem: function (array, item) {
        for (var i = 0, len = array.length; i < len; i++) {

            if (_.isEqual(array[i], item)) {
                array.splice(i, 1);
                i--;
            }
        }

        return array;
    }
    , defer: function (fn, delay, exclusion) {
        var timerID;
        return (function () {

            if (exclusion) {
                clearTimeout(timerID);
            }

            timerID = setTimeout(fn, delay);
            return timerID;
        })();

    }
    , isFunction: function (obj) {
        return _.isFunction(obj);
    }
    , isArray: function (obj) {
        return _.isArray(obj);
    }
    , isEqual: function (a, b) {
        return _.isEqual(a, b);
    }
    , isEmpty: function (obj) {
        return _.isEmpty(obj);
    }
};

/**
 * 扩展数组的删除操作
 *
 * @author wangbinbin
 */
Array.prototype.del = function (index) {
    if (isNaN(index) || index >= this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[index]) {
            this[n++] = this[i];
        }
    }
    this.length -= 1;
};

/**
 * 数组去重
 *
 */
Array.prototype.unique = function(){
	 var res = [];
	 var json = {};
	 for(var i = 0; i < this.length; i++) {
	 	var ele = JSON.stringify(this[i]);
		 if(!json[ele]){
			 res.push(this[i]);
			 json[ele] = 1;
		 }
	 }
	 return res;
}

/**
 * 得到指定元素的下标
 *
 * @author wangbinbin
 */
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (sdutil.isEqual(this[i], val)) return i;
    }
    return -1;
};

/**
 * 移除指定元素
 *
 * @author wangbinbin
 */
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

/**
 * 扩展日期的格式化操作
 * @param fmt 比如：  yyyy-MM-dd
 * @returns
 *
 * @author wangbinbin
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

(function () {

    var root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;

    var previousUnderscore = root._;

    var ArrayProto = Array.prototype, ObjProto = Object.prototype;
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeCreate = Object.create;

    var Ctor = function () {
    };

    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    _.VERSION = '1.8.3';

    var optimizeCb = function (func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount) {
            case 1:
                return function (value) {
                    return func.call(context, value);
                };
            case null:
            case 3:
                return function (value, index, collection) {
                    return func.call(context, value, index, collection);
                };
            case 4:
                return function (accumulator, value, index, collection) {
                    return func.call(context, accumulator, value, index, collection);
                };
        }
        return function () {
            return func.apply(context, arguments);
        };
    };

    var builtinIteratee;

    var cb = function (value, context, argCount) {
        if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
        return _.property(value);
    };

    _.iteratee = builtinIteratee = function (value, context) {
        return cb(value, context, Infinity);
    };

    var restArgs = function (func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function () {
            var length = Math.max(arguments.length - startIndex, 0),
                rest = Array(length),
                index = 0;
            for (; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0:
                    return func.call(this, rest);
                case 1:
                    return func.call(this, arguments[0], rest);
                case 2:
                    return func.call(this, arguments[0], arguments[1], rest);
            }
            var args = Array(startIndex + 1);
            for (index = 0; index < startIndex; index++) {
                args[index] = arguments[index];
            }
            args[startIndex] = rest;
            return func.apply(this, args);
        };
    };

    var baseCreate = function (prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
    };

    var shallowProperty = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    var deepGet = function (obj, path) {
        var length = path.length;
        for (var i = 0; i < length; i++) {
            if (obj == null) return void 0;
            obj = obj[path[i]];
        }
        return length ? obj : void 0;
    };

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = shallowProperty('length');
    var isArrayLike = function (collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        return obj;
    };

    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    var createReduce = function (dir) {
        var reducer = function (obj, iteratee, memo, initial) {
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length - 1;
            if (!initial) {
                memo = obj[keys ? keys[index] : index];
                index += dir;
            }
            for (; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        };

        return function (obj, iteratee, memo, context) {
            var initial = arguments.length >= 3;
            return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
        };
    };

    _.reduce = _.foldl = _.inject = createReduce(1);

    _.reduceRight = _.foldr = createReduce(-1);

    _.find = _.detect = function (obj, predicate, context) {
        var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
        var key = keyFinder(obj, predicate, context);
        if (key !== void 0 && key !== -1) return obj[key];
    };

    _.filter = _.select = function (obj, predicate, context) {
        var results = [];
        predicate = cb(predicate, context);
        _.each(obj, function (value, index, list) {
            if (predicate(value, index, list)) results.push(value);
        });
        return results;
    };

    _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
    };

    _.every = _.all = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    };

    _.some = _.any = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
    };

    _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
        if (!isArrayLike(obj)) obj = _.values(obj);
        if (typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
    };

    _.invoke = restArgs(function (obj, path, args) {
        var contextPath, func;
        if (_.isFunction(path)) {
            func = path;
        } else if (_.isArray(path)) {
            contextPath = path.slice(0, -1);
            path = path[path.length - 1];
        }
        return _.map(obj, function (context) {
            var method = func;
            if (!method) {
                if (contextPath && contextPath.length) {
                    context = deepGet(context, contextPath);
                }
                if (context == null) return void 0;
                method = context[path];
            }
            return method == null ? method : method.apply(context, args);
        });
    });

    _.pluck = function (obj, key) {
        return _.map(obj, _.property(key));
    };

    _.where = function (obj, attrs) {
        return _.filter(obj, _.matcher(attrs));
    };

    _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matcher(attrs));
    };

    _.max = function (obj, iteratee, context) {
        var result = -Infinity, lastComputed = -Infinity,
            value, computed;
        if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value != null && value > result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (v, index, list) {
                computed = iteratee(v, index, list);
                if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                    result = v;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    _.min = function (obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity,
            value, computed;
        if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value != null && value < result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (v, index, list) {
                computed = iteratee(v, index, list);
                if (computed < lastComputed || computed === Infinity && result === Infinity) {
                    result = v;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    _.shuffle = function (obj) {
        return _.sample(obj, Infinity);
    };

    _.sample = function (obj, n, guard) {
        if (n == null || guard) {
            if (!isArrayLike(obj)) obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
        }
        var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
        var length = getLength(sample);
        n = Math.max(Math.min(n, length), 0);
        var last = length - 1;
        for (var index = 0; index < n; index++) {
            var rand = _.random(index, last);
            var temp = sample[index];
            sample[index] = sample[rand];
            sample[rand] = temp;
        }
        return sample.slice(0, n);
    };

    _.sortBy = function (obj, iteratee, context) {
        var index = 0;
        iteratee = cb(iteratee, context);
        return _.pluck(_.map(obj, function (value, key, list) {
            return {
                value: value,
                index: index++,
                criteria: iteratee(value, key, list)
            };
        }).sort(function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        }), 'value');
    };

    var group = function (behavior, partition) {
        return function (obj, iteratee, context) {
            var result = partition ? [[], []] : {};
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index) {
                var key = iteratee(value, index, obj);
                behavior(result, value, key);
            });
            return result;
        };
    };

    _.groupBy = group(function (result, value, key) {
        if (_.has(result, key)) result[key].push(value); else result[key] = [value];
    });

    _.indexBy = group(function (result, value, key) {
        result[key] = value;
    });

    _.countBy = group(function (result, value, key) {
        if (_.has(result, key)) result[key]++; else result[key] = 1;
    });

    var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
    _.toArray = function (obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (_.isString(obj)) {
            return obj.match(reStrSymbol);
        }
        if (isArrayLike(obj)) return _.map(obj, _.identity);
        return _.values(obj);
    };

    _.size = function (obj) {
        if (obj == null) return 0;
        return isArrayLike(obj) ? obj.length : _.keys(obj).length;
    };

    _.partition = group(function (result, value, pass) {
        result[pass ? 0 : 1].push(value);
    }, true);

    _.first = _.head = _.take = function (array, n, guard) {
        if (array == null || array.length < 1) return void 0;
        if (n == null || guard) return array[0];
        return _.initial(array, array.length - n);
    };

    _.initial = function (array, n, guard) {
        return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };

    _.last = function (array, n, guard) {
        if (array == null || array.length < 1) return void 0;
        if (n == null || guard) return array[array.length - 1];
        return _.rest(array, Math.max(0, array.length - n));
    };

    _.rest = _.tail = _.drop = function (array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
    };

    _.compact = function (array) {
        return _.filter(array, Boolean);
    };

    var flatten = function (input, shallow, strict, output) {
        output = output || [];
        var idx = output.length;
        for (var i = 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                if (shallow) {
                    var j = 0, len = value.length;
                    while (j < len) output[idx++] = value[j++];
                } else {
                    flatten(value, shallow, strict, output);
                    idx = output.length;
                }
            } else if (!strict) {
                output[idx++] = value;
            }
        }
        return output;
    };

    _.flatten = function (array, shallow) {
        return flatten(array, shallow, false);
    };

    _.without = restArgs(function (array, otherArrays) {
        return _.difference(array, otherArrays);
    });

    _.uniq = _.unique = function (array, isSorted, iteratee, context) {
        if (!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
        }
        if (iteratee != null) iteratee = cb(iteratee, context);
        var result = [];
        var seen = [];
        for (var i = 0, length = getLength(array); i < length; i++) {
            var value = array[i],
                computed = iteratee ? iteratee(value, i, array) : value;
            if (isSorted) {
                if (!i || seen !== computed) result.push(value);
                seen = computed;
            } else if (iteratee) {
                if (!_.contains(seen, computed)) {
                    seen.push(computed);
                    result.push(value);
                }
            } else if (!_.contains(result, value)) {
                result.push(value);
            }
        }
        return result;
    };

    _.union = restArgs(function (arrays) {
        return _.uniq(flatten(arrays, true, true));
    });

    _.intersection = function (array) {
        var result = [];
        var argsLength = arguments.length;
        for (var i = 0, length = getLength(array); i < length; i++) {
            var item = array[i];
            if (_.contains(result, item)) continue;
            var j;
            for (j = 1; j < argsLength; j++) {
                if (!_.contains(arguments[j], item)) break;
            }
            if (j === argsLength) result.push(item);
        }
        return result;
    };

    _.difference = restArgs(function (array, rest) {
        rest = flatten(rest, true, true);
        return _.filter(array, function (value) {
            return !_.contains(rest, value);
        });
    });

    _.unzip = function (array) {
        var length = array && _.max(array, getLength).length || 0;
        var result = Array(length);

        for (var index = 0; index < length; index++) {
            result[index] = _.pluck(array, index);
        }
        return result;
    };

    _.zip = restArgs(_.unzip);

    _.object = function (list, values) {
        var result = {};
        for (var i = 0, length = getLength(list); i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };
    var createPredicateIndexFinder = function (dir) {
        return function (array, predicate, context) {
            predicate = cb(predicate, context);
            var length = getLength(array);
            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
                if (predicate(array[index], index, array)) return index;
            }
            return -1;
        };
    };

    _.findIndex = createPredicateIndexFinder(1);
    _.findLastIndex = createPredicateIndexFinder(-1);
    _.sortedIndex = function (array, obj, iteratee, context) {
        iteratee = cb(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0, high = getLength(array);
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
        }
        return low;
    };
    var createIndexFinder = function (dir, predicateFind, sortedIndex) {
        return function (array, item, idx) {
            var i = 0, length = getLength(array);
            if (typeof idx == 'number') {
                if (dir > 0) {
                    i = idx >= 0 ? idx : Math.max(idx + length, i);
                } else {
                    length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
                }
            } else if (sortedIndex && idx && length) {
                idx = sortedIndex(array, item);
                return array[idx] === item ? idx : -1;
            }
            if (item !== item) {
                idx = predicateFind(slice.call(array, i, length), _.isNaN);
                return idx >= 0 ? idx + i : -1;
            }
            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
                if (array[idx] === item) return idx;
            }
            return -1;
        };
    };
    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
    _.range = function (start, stop, step) {
        if (stop == null) {
            stop = start || 0;
            start = 0;
        }
        if (!step) {
            step = stop < start ? -1 : 1;
        }

        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);

        for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
        }

        return range;
    };

    _.chunk = function (array, count) {
        if (count == null || count < 1) return [];

        var result = [];
        var i = 0, length = array.length;
        while (i < length) {
            result.push(slice.call(array, i, i += count));
        }
        return result;
    };

    var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
        if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
        var self = baseCreate(sourceFunc.prototype);
        var result = sourceFunc.apply(self, args);
        if (_.isObject(result)) return result;
        return self;
    };

    _.bind = restArgs(function (func, context, args) {
        if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
        var bound = restArgs(function (callArgs) {
            return executeBound(func, bound, context, this, args.concat(callArgs));
        });
        return bound;
    });

    _.partial = restArgs(function (func, boundArgs) {
        var placeholder = _.partial.placeholder;
        var bound = function () {
            var position = 0, length = boundArgs.length;
            var args = Array(length);
            for (var i = 0; i < length; i++) {
                args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
            }
            while (position < arguments.length) args.push(arguments[position++]);
            return executeBound(func, bound, this, this, args);
        };
        return bound;
    });

    _.partial.placeholder = _;

    _.bindAll = restArgs(function (obj, keys) {
        keys = flatten(keys, false, false);
        var index = keys.length;
        if (index < 1) throw new Error('bindAll must be passed function names');
        while (index--) {
            var key = keys[index];
            obj[key] = _.bind(obj[key], obj);
        }
    });

    _.memoize = function (func, hasher) {
        var memoize = function (key) {
            var cache = memoize.cache;
            var address = '' + (hasher ? hasher.apply(this, arguments) : key);
            if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
            return cache[address];
        };
        memoize.cache = {};
        return memoize;
    };

    _.delay = restArgs(function (func, wait, args) {
        return setTimeout(function () {
            return func.apply(null, args);
        }, wait);
    });

    _.defer = _.partial(_.delay, _, 1);

    _.throttle = function (func, wait, options) {
        var timeout, context, args, result;
        var previous = 0;
        if (!options) options = {};

        var later = function () {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };

        var throttled = function () {
            var now = _.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };

        throttled.cancel = function () {
            clearTimeout(timeout);
            previous = 0;
            timeout = context = args = null;
        };

        return throttled;
    };

    _.debounce = function (func, wait, immediate) {
        var timeout, result;

        var later = function (context, args) {
            timeout = null;
            if (args) result = func.apply(context, args);
        };

        var debounced = restArgs(function (args) {
            if (timeout) clearTimeout(timeout);
            if (immediate) {
                var callNow = !timeout;
                timeout = setTimeout(later, wait);
                if (callNow) result = func.apply(this, args);
            } else {
                timeout = _.delay(later, wait, this, args);
            }

            return result;
        });

        debounced.cancel = function () {
            clearTimeout(timeout);
            timeout = null;
        };

        return debounced;
    };

    _.wrap = function (func, wrapper) {
        return _.partial(wrapper, func);
    };

    _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments);
        };
    };

    _.compose = function () {
        var args = arguments;
        var start = args.length - 1;
        return function () {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) result = args[i].call(this, result);
            return result;
        };
    };

    _.after = function (times, func) {
        return function () {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };

    _.before = function (times, func) {
        var memo;
        return function () {
            if (--times > 0) {
                memo = func.apply(this, arguments);
            }
            if (times <= 1) func = null;
            return memo;
        };
    };

    _.once = _.partial(_.before, 2);

    _.restArgs = restArgs;

    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
        'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

    var collectNonEnumProps = function (obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

        var prop = 'constructor';
        if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

        while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                keys.push(prop);
            }
        }
    };

    _.keys = function (obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    _.allKeys = function (obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    _.values = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    _.mapObject = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = _.keys(obj),
            length = keys.length,
            results = {};
        for (var index = 0; index < length; index++) {
            var currentKey = keys[index];
            results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    _.pairs = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
    };

    _.invert = function (obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    var createAssigner = function (keysFunc, defaults) {
        return function (obj) {
            var length = arguments.length;
            if (defaults) obj = Object(obj);
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!defaults || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };

    _.extend = createAssigner(_.allKeys);

    _.extendOwn = _.assign = createAssigner(_.keys);

    _.findKey = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = _.keys(obj), key;
        for (var i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            if (predicate(obj[key], key, obj)) return key;
        }
    };

    var keyInObj = function (value, key, obj) {
        return key in obj;
    };

    _.pick = restArgs(function (obj, keys) {
        var result = {}, iteratee = keys[0];
        if (obj == null) return result;
        if (_.isFunction(iteratee)) {
            if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
            keys = _.allKeys(obj);
        } else {
            iteratee = keyInObj;
            keys = flatten(keys, false, false);
            obj = Object(obj);
        }
        for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var value = obj[key];
            if (iteratee(value, key, obj)) result[key] = value;
        }
        return result;
    });

    _.omit = restArgs(function (obj, keys) {
        var iteratee = keys[0], context;
        if (_.isFunction(iteratee)) {
            iteratee = _.negate(iteratee);
            if (keys.length > 1) context = keys[1];
        } else {
            keys = _.map(flatten(keys, false, false), String);
            iteratee = function (value, key) {
                return !_.contains(keys, key);
            };
        }
        return _.pick(obj, iteratee, context);
    });

    _.defaults = createAssigner(_.allKeys, true);

    _.create = function (prototype, props) {
        var result = baseCreate(prototype);
        if (props) _.extendOwn(result, props);
        return result;
    };

    _.clone = function (obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    _.tap = function (obj, interceptor) {
        interceptor(obj);
        return obj;
    };

    _.isMatch = function (object, attrs) {
        var keys = _.keys(attrs), length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    };


    var eq, deepEq;
    eq = function (a, b, aStack, bStack) {
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        if (a == null || b == null) return false;
        if (a !== a) return b !== b;
        var type = typeof a;
        if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
        return deepEq(a, b, aStack, bStack);
    };

    deepEq = function (a, b, aStack, bStack) {
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            case '[object RegExp]':
            case '[object String]':
                return '' + a === '' + b;
            case '[object Number]':
                if (+a !== +a) return +b !== +b;
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                return +a === +b;
            case '[object Symbol]':
                return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
        }

        var areArrays = className === '[object Array]';
        if (!areArrays) {
            if (typeof a != 'object' || typeof b != 'object') return false;
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                _.isFunction(bCtor) && bCtor instanceof bCtor)
                && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            if (aStack[length] === a) return bStack[length] === b;
        }

        aStack.push(a);
        bStack.push(b);

        if (areArrays) {
            length = a.length;
            if (length !== b.length) return false;
            while (length--) {
                if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            var keys = _.keys(a), key;
            length = keys.length;
            if (_.keys(b).length !== length) return false;
            while (length--) {
                key = keys[length];
                if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        aStack.pop();
        bStack.pop();
        return true;
    };

    _.isEqual = function (a, b) {
        return eq(a, b);
    };

    _.isEmpty = function (obj) {
        if (obj == null) return true;
        if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
        return _.keys(obj).length === 0;
    };

    _.isElement = function (obj) {
        return !!(obj && obj.nodeType === 1);
    };

    _.isArray = nativeIsArray || function (obj) {
            return toString.call(obj) === '[object Array]';
        };

    _.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    if (!_.isArguments(arguments)) {
        _.isArguments = function (obj) {
            return _.has(obj, 'callee');
        };
    }

    var nodelist = root.document && root.document.childNodes;
    if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
        _.isFunction = function (obj) {
            return typeof obj == 'function' || false;
        };
    }

    _.isFinite = function (obj) {
        return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
    };

    _.isNaN = function (obj) {
        return _.isNumber(obj) && isNaN(obj);
    };

    _.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };

    _.isNull = function (obj) {
        return obj === null;
    };

    _.isUndefined = function (obj) {
        return obj === void 0;
    };

    _.has = function (obj, path) {
        if (!_.isArray(path)) {
            return obj != null && hasOwnProperty.call(obj, path);
        }
        var length = path.length;
        for (var i = 0; i < length; i++) {
            var key = path[i];
            if (obj == null || !hasOwnProperty.call(obj, key)) {
                return false;
            }
            obj = obj[key];
        }
        return !!length;
    };

    _.noConflict = function () {
        root._ = previousUnderscore;
        return this;
    };

    _.identity = function (value) {
        return value;
    };

    _.constant = function (value) {
        return function () {
            return value;
        };
    };

    _.noop = function () {
    };

    _.property = function (path) {
        if (!_.isArray(path)) {
            return shallowProperty(path);
        }
        return function (obj) {
            return deepGet(obj, path);
        };
    };

    _.propertyOf = function (obj) {
        if (obj == null) {
            return function () {
            };
        }
        return function (path) {
            return !_.isArray(path) ? obj[path] : deepGet(obj, path);
        };
    };

    _.matcher = _.matches = function (attrs) {
        attrs = _.extendOwn({}, attrs);
        return function (obj) {
            return _.isMatch(obj, attrs);
        };
    };

    _.times = function (n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = optimizeCb(iteratee, context, 1);
        for (var i = 0; i < n; i++) accum[i] = iteratee(i);
        return accum;
    };

    _.random = function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    _.now = Date.now || function () {
            return new Date().getTime();
        };

    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };
    var unescapeMap = _.invert(escapeMap);

    var createEscaper = function (map) {
        var escaper = function (match) {
            return map[match];
        };
        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function (string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };
    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);

    _.result = function (obj, path, fallback) {
        if (!_.isArray(path)) path = [path];
        var length = path.length;
        if (!length) {
            return _.isFunction(fallback) ? fallback.call(obj) : fallback;
        }
        for (var i = 0; i < length; i++) {
            var prop = obj == null ? void 0 : obj[path[i]];
            if (prop === void 0) {
                prop = fallback;
                i = length;
            }
            obj = _.isFunction(prop) ? prop.call(obj) : prop;
        }
        return obj;
    };

    var idCounter = 0;
    _.uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    var noMatch = /(.)^/;

    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

    var escapeChar = function (match) {
        return '\\' + escapes[match];
    };

    _.template = function (text, settings, oldSettings) {
        if (!settings && oldSettings) settings = oldSettings;
        settings = _.defaults({}, settings, _.templateSettings);

        var matcher = RegExp([
                (settings.escape || noMatch).source,
                (settings.interpolate || noMatch).source,
                (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');

        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
            index = offset + match.length;

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            } else if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }

            return match;
        });
        source += "';\n";

        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + 'return __p;\n';

        var render;
        try {
            render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        var template = function (data) {
            return render.call(this, data, _);
        };

        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';

        return template;
    };

    _.chain = function (obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    };

    var chainResult = function (instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    };

    _.mixin = function (obj) {
        _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return chainResult(this, func.apply(_, args));
            };
        });
        return _;
    };

    _.mixin(_);

    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
            return chainResult(this, obj);
        };
    });

    _.each(['concat', 'join', 'slice'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            return chainResult(this, method.apply(this._wrapped, arguments));
        };
    });

    _.prototype.value = function () {
        return this._wrapped;
    };

    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function () {
        return String(this._wrapped);
    };

    if (typeof define == 'function' && define.amd) {
        define('underscore', [], function () {
            return _;
        });
    }
}());


/**
 * 定义sdui事件模型
 *
 * @author wangbinbin
 * @date 2016/11/28
 *
 */
var SdEvent = function () {
}

SdEvent.prototype = {
    addListener: function (types, fn) { // 添加事件监听
        var _this = this;

        var types = sdutil.trim(types).split(' ');


        for (var i = 0, type; type = types[i++];) {

            _this.getListener(type, true).push(fn)
        }
    }
    , getListener: function (type, force) {
        var allListeners, _this = this;
        type = type.toLowerCase();
        return ( ( allListeners = ( _this._eventList || force && ( _this._eventList = {} ) ) )
        && ( allListeners[type] || force && ( allListeners[type] = [] ) ) );
    }
    , removeListener: function (types, fn) {
        var _this = this;

        types = sdutil.trim(types).split(' ');
        for (var i = 0, type; type = types[i++];) {

            sdutil.removeItem(_this.getListener(type) || [], fn);
        }
    }
    , removeAllListener: function (types) {
        var _this = this;

        types = sdutil.trim(types).split(' ');
        for (var i = 0, type; type = types[i++];) {
            if (_this._eventList[type]) {
                _this._eventList[type] = [];
            }
        }
    }
    , on: function (type, fn) {  // 订阅事件
        var _this = this;
        return _this.addListener(type, fn);
    }
    , un: function (type, fn) { // 取消订阅
        var _this = this;

        return _this.removeListener(type, fn);
    }
    , off: function (types) {
        var _this = this;

        return _this.removeAllListener(types);
    }
    , fire: function () { // 触发事件
        var _this = this
        if (arguments.length < 1) return _this;

        var args = Array.prototype.slice.call(arguments), types = args.shift();

        types = sdutil.trim(types).split(' ');

        for (var i = 0, type; type = types[i++];) {
            var fns = _this.getListener(type);

            if (fns) {
                var n = fns.length;
                while (n--) {
                    if (fns[n]) {
                        fns[n].apply(_this, args);
                    }
                }
            }
        }
        return _this;
    }
};


/**
 * 覆写jquery默认resize方法，使其可以监控页面元素大小的改变
 * @param $
 * @param h
 * @param c
 */
;
(function ($, window, undefined) {
    '$:nomunge';

    var elems = $([]),

        jq_resize = $.resize = $.extend($.resize, {}),

        timeout_id,

        str_setTimeout = 'setTimeout',
        str_resize = 'resize',
        str_data = str_resize + '-special-event',
        str_delay = 'delay',
        str_throttle = 'throttleWindow';


    jq_resize[str_delay] = 250;

    jq_resize[str_throttle] = true;


    $.event.special[str_resize] = {

        setup: function () {
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var elem = $(this);

            elems = elems.add(elem);

            $.data(this, str_data, {w: elem.width(), h: elem.height()});

            if (elems.length === 1) {
                loopy();
            }
        },

        teardown: function () {
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var elem = $(this);

            elems = elems.not(elem);

            elem.removeData(str_data);

            if (!elems.length) {
                clearTimeout(timeout_id);
            }
        },

        // Called every time a 'resize' event callback is bound per element (new in
        // jQuery 1.4).
        add: function (handleObj) {
            // Since window has its own native 'resize' event, return false so that
            // jQuery doesn't modify the event object. Unless, of course, we're
            // throttling the 'resize' event for window.
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var old_handler;

            // The new_handler function is executed every time the event is triggered.
            // This is used to update the internal element data store with the width
            // and height when the event is triggered manually, to avoid double-firing
            // of the event callback. See the "Double firing issue in jQuery 1.3.2"
            // comments above for more information.

            function new_handler(e, w, h) {
                var elem = $(this),
                    data = $.data(this, str_data);

                // If called from the polling loop, w and h will be passed in as
                // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
                // those values will need to be computed.
                data.w = w !== undefined ? w : elem.width();
                data.h = h !== undefined ? h : elem.height();

                old_handler.apply(this, arguments);
            };

            // This may seem a little complicated, but it normalizes the special event
            // .add method between jQuery 1.4/1.4.1 and 1.4.2+
            if ($.isFunction(handleObj)) {
                // 1.4, 1.4.1
                old_handler = handleObj;
                return new_handler;
            } else {
                // 1.4.2+
                old_handler = handleObj.handler;
                handleObj.handler = new_handler;
            }
        }

    };

    function loopy() {

        // Start the polling loop, asynchronously.
        timeout_id = window[str_setTimeout](function () {

            // Iterate over all elements to which the 'resize' event is bound.
            elems.each(function () {
                var elem = $(this),
                    width = elem.width(),
                    height = elem.height(),
                    data = $.data(this, str_data);

                // If element size has changed since the last time, update the element
                // data store and trigger the 'resize' event.
                if (width !== data.w || height !== data.h) {
                    elem.trigger(str_resize, [data.w = width, data.h = height]);
                }

            });

            // Loop.
            loopy();

        }, jq_resize[str_delay]);

    };

})(jQuery, window);

/**
 * 扩展jquery ajax，对ajax请求进行包装，添加更多个性化设计；
 * 所有基于jquery ajax的操作，都在此类中进行共通化;
 *
 * @param $ jQuery选择器
 *
 * @author    wangbinbin
 * @date    2016/10/18
 */
// 扩展jquery实现
(function ($) {
    $.extend({
        sdAjax: function (opt) {

            var defaults = {
                url: '', 		// 后台请求地址
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                cache: false,
                data: "", 	// 请求参数
                async: true, 	// 是否异步
                waitFlag: true, // 是否需要加载等待动画
                successCallback: null,
                errorCallback: null
            }
            var opts = $.extend(true, {}, defaults, opt);

            var time = new Date().getTime();

            if (opts.url.indexOf('?') != -1) {
                opts.url = opts.url + "&time=" + time;
            } else {
                opts.url = opts.url + "?time=" + time;
            }

            var mlayer = layer;

            if (parent && parent.parent) {
                mlayer = parent.parent.layer;
            } else if (parent) {
                mlayer = parent.layer;
            }


            // 添加等待动画
            if (opts.waitFlag) {
                mlayer.load();
            }

            // 如果contentType为json,则应该序列号用户数据
            if (opts.contentType == 'application/json') {
                opts.data = JSON.stringify(opts.data);
            }

            $.ajax({
                type: opts.type,
                dataType: opts.dataType,
                url: opts.url,
                data: opts.data,
                contentType: opts.contentType,
                async: opts.async,
                success: function (data) {
                    // 关闭所有加载层
                    mlayer.closeAll('loading');

                    if (sdutil.isFunction(opts.successCallback)) {
                        opts.successCallback.call('', data);
                    }
                },
                error: function (XMLHttpRequest, txtStatus, errorThrown) {

                    // 关闭所有加载层
                    mlayer.closeAll('loading');

                    if (sdutil.isFunction(opts.errorCallback)) {

                        opts.errorCallback.call();

                    } else {
                        // 出错了，给个吐司提示
                        message('请求提交有误，请稍后重试');
                    }
                }
            });
        }
    });

})(jQuery);


/**
 * 目前的弹出层相关UI显示，都是基于layer前端插件；
 * 此封装的意义在于：对调用者透明化依赖的具体插件，同时也便于后期进行扩展或替换第三方依赖，不影响界面的调用
 *
 * @param $ jQuery选择器
 *
 * @author    wangbinbin
 * @date    2016/10/18
 */
(function ($) {

    var mlayer = layer;

    if (parent && parent.parent) {
        mlayer = parent.parent.layer;
    } else if (parent) {
        mlayer = parent.layer;
    }

    // 确认框
    window.alert = function (content, callback, autoclose) {
        tmpalert(0, content, callback, autoclose);
    }

    // 成功提示框
    success = function (content, callback, autoclose) {
        tmpalert(1, content, callback, autoclose);
    }

    // 错误提示框
    error = function (content, callback, autoclose) {
        tmpalert(2, content, callback, autoclose);
    }

    function tmpalert(type, content, callback, autoclose) {
        var sdEvent = new SdEvent();

        sdEvent.on('close', function (index, callback) {

            if (sdutil.isFunction(callback)) {
                callback.call();
            }

            mlayer.close(index);

            sdEvent.off('close');
        });

        var _index = mlayer.alert(content, {icon: type}, function (index) {

            sdEvent.fire('close', index, callback);
        });

        // 如果设置了自动关闭，则执行关闭动作
        autoclose == true && sdutil.defer(function () {
            sdEvent.fire('close', _index, callback);
        }, 2000);
    }

    // 确认框
    window.confirm = function (content, successCallback, cannelCallback) {

        mlayer.confirm(content, {
            btn: ['确认', '取消'] //按钮
        }, function (index) {
            if (sdutil.isFunction(successCallback)) {
                successCallback.call();
            }

            mlayer.close(index);

        }, function (index) {

            if (sdutil.isFunction(cannelCallback)) {
                cannelCallback.call();
            }

            mlayer.close(index);
        });
    }

    // 信息提示框
    message = function (content) {
        mlayer.msg(content);
    }

    // 提示
    tip = function (content, id, opts) {

        if (opts) {
            mlayer.tips(content, '#' + id, opts);
        } else {
            mlayer.tips(content, '#' + id);
        }

    }

    // 对话框，用于打开新的弹出页面，为了代码可维护性，目前都采用新页面加载
    dialog = function (opts) {

        var defaults = {
            content: '',
            title: '',
            type: 2,
            width: '800px',
            height: '90%',
            shadeClose: false,
            scroll: true,
            end: null // 此处应该是一个function
        }


        var opts = $.extend(true, {}, defaults, opts);

        var scroll = 'yes';
        if (opts.scroll == false) {
            scroll = 'no';
        }

        var _tmp_content = [opts.content, scroll];
        if (opts.type == 1) {
            _tmp_content = opts.content;
        }

        mlayer.open({
            type: opts.type,
            title: opts.title,
            shadeClose: opts.shadeClose,
            shade: 0.8,
            area: [opts.width, opts.height],
            content: _tmp_content,
            end: opts.end
        });
    }

    // 关闭父弹出层
    closeParent = function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        mlayer.close(index);
    }

    closeAll = function () {
        mlayer.closeAll();
    }

})(jQuery);


/**
 * sdGrid目的在于简化及统一用户加载列表的操作。用户只要调用此插件，即可轻松生成带分页的列表数据。代码量大大减少
 *
 * @param $ jQuery选择器
 *
 * @author    wangbinbin
 * @date    2016/10/18
 */
(function ($) {

    // 初始化一些常量信息，便于后期统一调整
    var noresult = '暂无数据'


    $.fn.sdGrid = function (property) {

        var _this = this;

        var defaultProperty = {
            url: '',
            cache: false,
            type: 'GET',
            pageSize: 10,
            async: true,	// 是否异步 
            data: {},  	// 待发送数据
            size: 10, 	// 每页读取记录数
            waitFlag: true, //是否显示等待动画
            style: {
                border: 'solid 1px #DCDEDE',
                width: '100%'
            },
            theme: '',  //目前有扩展的两个主题： 简洁主题： sdGrid-brief 简洁绿：sdGrid-brief-red
            showTHead: true,
            headBtns: {	// 定义数据列表 头部按钮区域
                borderBottom: '', // solid 1px #d0dee5
                marginBottom: '10px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                height: '33px',
                innerHtml: function () {
                    return '';
                }
            },
            colProperty: [	// 定义数据列表显示区域渲染

            ],
            callback: function () {
                // 数据加载完成后，希望执行的操作
            },
            pagination: {
                show: true,
                pageSize: 10,
                style: {
                    color: '#08c'
                }
            }
        }

        var mergedProperty = $.extend(true, {}, defaultProperty, property);

        // 初始化列表数据
        loadingTable(_this, mergedProperty, 1);

    }

    // 初始化头部按钮
    function initHeadBtns(selector, property) {

        if (property.headBtns.innerHtml) {

            var headBtnsContent = property.headBtns.innerHtml.call();

            if ($.trim(headBtnsContent) != '') {

                headBtnArea = document.createElement('div');
                headBtnArea.className = 'top-area';

                headBtnArea.innerHTML = headBtnsContent;

                selector[0].appendChild(headBtnArea);
            }
        }

    }

    // 请求加载后台数据
    function loadingTable(selector, property, currentPage) {

        $(selector).empty();

        $(selector).addClass('sdGrid ' + property.theme);

        /*------------------------ 初始化表头按钮区域 ----------------------- */
        initHeadBtns(selector, property);
        /*------------------------ 初始化表头按钮区域 ----------------------- */

        /*------------------------ 初始化表格区域 -------------------------- */
        table = document.createElement('table');

        if (property.showTHead) {
            // 构建table header
            table.appendChild(tableHeadBuilder(property));
        }

        // 构建table body
        tbody = document.createElement('tbody');

        table.appendChild(tbody);

        selector[0].appendChild(table);

        /*------------------------ 初始化表格区域 -------------------------- */

        var tmpurl = property.url;

        if (property.pagination.show && property.pagination.show == true) {
            var pageSize = 10;
            if (property.pagination.pageSize) {
                pageSize = property.pagination.pageSize;
            }

            // GET请求，应该是在路径后拼接
            if (property.type == 'get' || property.type == 'GET') {
                if (property.url) {
                    if (property.url.indexOf('?') > 0) {
                        tmpurl += ('&page=' + currentPage + '&pageSize=' + pageSize);
                    } else {
                        tmpurl += ('?page=' + currentPage + '&pageSize=' + pageSize);
                    }
                }

            } else {
                property.data['page'] = currentPage;
                property.data['pageSize'] = pageSize;
                property.contentType = "application/json";
            }
        }


        $.sdAjax({
            url: tmpurl,
            cache: property.cache,
            dataType: 'json',
            type: property.type,
            data: property.data,
            contentType: property.contentType,
            async: property.async,
            waitFlag: property.waitFlag,
            successCallback: function (data) {
                // 渲染列表数据
                addTableData(selector, property, data.data);

                // 只有指定显示分页，然后才会显示
                if (property.pagination.show && property.pagination.show == true) {
                    // 加载成功后，初始化page样式
                    pager(selector, property, data.data);
                }
            },
            errorCallback: function () {
                noRecordSet(selector, property.colProperty.length);

                // 只有指定显示分页，然后才会显示
                if (property.pagination.show && property.pagination.show == true) {
                    // 加载成功后，初始化page样式
                    var data = {};
                    data.page = {};
                    data.page.page = 1;
                    data.page.total = 0;
                    data.page.totalPage = 1;
                    pager(selector, property, data);
                }
            }
        });

    }

    function tableHeadBuilder(property) {
        // 创建表格头元素
        thead = document.createElement('thead');

        for (var i = 0; i < property.colProperty.length; i++) {
            // 创建头cell
            th = document.createElement('th');
            if (property.colProperty[i].style && property.colProperty[i].style.background) {
                th.style.background = property.colProperty[i].style.background;
            }

            // 设置头部高度
            if (property.colProperty[i].style && property.colProperty[i].style.height) {
                th.style.height = property.colProperty[i].style.height;
                th.style.lineHeight = property.colProperty[i].style.height;
            }

            // 设置表头文本对齐方式
            if (property.colProperty[i].style && property.colProperty[i].style.textAlign) {
                th.style.textAlign = property.colProperty[i].style.textAlign;
            }

            // 设置表头右边框样式
            if (property.colProperty[i].style && property.colProperty[i].style.borderRight) {
                th.style.borderRight = property.colProperty[i].style.borderRight;
            }

            if (property.colProperty[i].style && property.colProperty[i].style.borderBottom) {
                th.style.borderBottom = property.colProperty[i].style.borderBottom;
            }


            if (property.colProperty[i].style && property.colProperty[i].style.width) {
                th.style.width = property.colProperty[i].style.width;
            }

            // 设置字体颜色
            if (property.colProperty[i].style && property.colProperty[i].style.color) {
                th.style.color = property.colProperty[i].style.color;
            }

            // 设置字体大小
            if (property.colProperty[i].style && property.colProperty[i].style.fontSize) {
                th.style.fontSize = property.colProperty[i].style.fontSize;
            }

            th.innerHTML = property.colProperty[i].colLabel;
            // 将头cell添加至head中
            thead.appendChild(th);
        }

        return thead;
    }

    function rowUpdateEvent(row, property) {

        var rowdata = $(row).data('rowrecord');

        $(row).empty();

        if (property.colProperty) {

            // 设置每列单元格
            for (var j = 0; j < property.colProperty.length; j++) {

                td = document.createElement('td');

                tddiv = document.createElement('div');


                if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.height) {
                    td.style.height = property.colProperty[j].colModel.style.height;
//					td.style.lineHeight = property.colProperty[j].colModel.style.height;
                }

                if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.width) {
                    td.style.width = property.colProperty[j].colModel.style.width;
                }

                if (property.colProperty[j].style && property.colProperty[j].style.width) {
                    tddiv.style.width = property.colProperty[j].style.width; // 宽度必须设置，否则不出现“省略符”
                }


                // 内容超过长度，是否显示省略号
                if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.ellipsis && property.colProperty[j].colModel.style.ellipsis == true) {
                    tddiv.style.width = property.colProperty[j].style.width; // 宽度必须设置，否则不出现“省略符”
                    tddiv.style.height = td.style.height;
                    tddiv.style.lineHeight = td.style.height;

                    tddiv.style.display = 'block';
                    tddiv.style.whiteSpace = 'nowrap';
                    tddiv.style.overflow = 'hidden';
                    tddiv.style.textOverflow = 'ellipsis';
                }

                // 设置数据库右边框样式 
                if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.borderLeft) {
                    td.style.borderLeft = property.colProperty[j].colModel.style.borderLeft;
                }

                // 设置数据行文本对齐方式
                if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.textAlign) {
                    td.style.textAlign = property.colProperty[j].colModel.style.textAlign;
                }

                // 设置字体颜色
                if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.color) {
                    td.style.color = property.colProperty[j].colModel.style.color;
                }

                // 设置字体大小
                if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.fontSize) {
                    td.style.fontSize = property.colProperty[j].colModel.style.fontSize;
                }

                // 设置字体权重
                if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.fontWeight) {
                    td.style.fontWeight = property.colProperty[j].colModel.style.fontWeight;
                }

                tddiv.innerHTML = property.colProperty[j].colModel.innerHtml.call('', rowdata);

                td.appendChild(tddiv);

                $(row).append(td);

            }

            // 执行回调
            if (sdutil.isFunction(property.callback)) {
                property.callback.call();
            }
        }
    }

    // 初始化列表数据
    function addTableData(selector, property, data) {
        // 每次记载数据时，应该清空数据
        $(selector).children('table').children('tbody').empty();

        // 有数据时，初始化遍历记录集，否则设置默认值
        if (data && data.isSuccess && data.records.length > 0) {

            for (var i = 0; i < data.records.length; i++) {

                tr = document.createElement('tr');

                if (property.style && property.style.rowbackground) {
                    tr.style.background = property.style.rowbackground;
                }

                tr.style.borderTop = '1px solid #DCDEDE';

                if (i % 2 == 1) { // 偶数行，高亮显示
                    if (property.style && property.style.evenRowbackground) {
                        tr.style.background = property.style.evenRowbackground;
                    }
                }

                $(tr).data('rowrecord', data.records[i]);

                $(tr).bind("update", function () {
                    var row = this;
                    rowUpdateEvent(row, property);
                });

                if (property.colProperty) {
                    // 设置每列单元格
                    for (var j = 0; j < property.colProperty.length; j++) {

                        td = document.createElement('td');

                        tddiv = document.createElement('div');


                        // 设置数据行高度
                        if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.height) {
                            td.style.height = property.colProperty[j].colModel.style.height;
//							td.style.lineHeight = property.colProperty[j].colModel.style.height;
                        }

                        if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.width) {
                            td.style.width = property.colProperty[j].colModel.style.width;
                        }

                        if (property.colProperty[j].style && property.colProperty[j].style.width) {
                            tddiv.style.width = property.colProperty[j].style.width; // 宽度必须设置，否则不出现“省略符”
                        }


                        // 内容超过长度，是否显示省略号
                        if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.ellipsis && property.colProperty[j].colModel.style.ellipsis == true) {
                            tddiv.style.width = property.colProperty[j].style.width; // 宽度必须设置，否则不出现“省略符”
                            tddiv.style.height = td.style.height;
                            tddiv.style.lineHeight = td.style.height;

                            tddiv.style.display = 'block';
                            tddiv.style.whiteSpace = 'nowrap';
                            tddiv.style.overflow = 'hidden';
                            tddiv.style.textOverflow = 'ellipsis';
                        }

                        // 设置数据库右边框样式 
                        if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.borderLeft) {
                            td.style.borderLeft = property.colProperty[j].colModel.style.borderLeft;
                        }

                        // 设置数据行文本对齐方式
                        if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.textAlign) {
                            td.style.textAlign = property.colProperty[j].colModel.style.textAlign;
                        }

                        // 设置字体颜色
                        if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.color) {
                            td.style.color = property.colProperty[j].colModel.style.color;
                        }

                        // 设置字体大小
                        if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.fontSize) {
                            td.style.fontSize = property.colProperty[j].colModel.style.fontSize;
                        }

                        // 设置字体权重
                        if (property.colProperty[j].colModel && property.colProperty[j].colModel.style && property.colProperty[j].colModel.style.fontWeight) {
                            td.style.fontWeight = property.colProperty[j].colModel.style.fontWeight;
                        }

                        tddiv.innerHTML = property.colProperty[j].colModel.innerHtml.call('', data.records[i], tr);

                        td.appendChild(tddiv);

                        tr.appendChild(td);
                    }
                }

                $(selector).children('table').children('tbody')[0].appendChild(tr);

            }

            /*$(selector).children('table').children('tbody').children('tr').hover(function(){
             $(this).addClass('sdgrid-tr-hover');
             },function(){
             $(this).removeClass('sdgrid-tr-hover');
             });
             */

        } else {
            noRecordSet(selector, property.colProperty.length);
        }

        // 执行回调
        if (sdutil.isFunction(property.callback)) {
            property.callback.call();
        }
    }

    // 无数据行渲染
    function noRecordSet(table, colspan) {
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.colSpan = colspan;
        td.style.lineHeight = '35px';
        td.style.textIndent = '11px';
        //td.style.borderRight = 'dotted 1px #c7c7c7';
        td.style.textAlign = 'center';
        td.innerHTML = '暂无数据';
        td.style.background = '#f9f9f9'
        tr.appendChild(td);
        $(table).children('table').children('tbody')[0].appendChild(tr);
    }

    // 分页信息构造器
    function pager(selector, property, data) {
        var currentPage = 1;
        var totalPage = 1;

        if (data && data.isSuccess) {
            currentPage = data.page.page;
            totalPage = data.page.totalPage;
        }
        var pager_div = document.createElement('div');
        pager_div.className = 'sdgrid-pager';

        if (!property.pagination.type || property.pagination.type == 0) {
            var message_div = document.createElement('div');
            message_div.style.float = 'left';
            message_div.style.marginTop = '10px';
            message_div.style.marginBottom = '10px';
            message_div.addClass = 'message';
            message_div.innerHTML = '共 <i class="highlight">' + data.page.total + '</i> 条记录，当前显示第 <i class="highlight">' + currentPage + '</i> 页';
            pager_div.appendChild(message_div);
        }
        var pagination_div = document.createElement('div');
        pagination_div.id = 'sdgrid-page' + new Date().getTime();
        pagination_div.style.float = 'right';
        pager_div.appendChild(pagination_div);

        pager_div.style.width = property.style.width;

        selector[0].appendChild(pager_div);


        // 初始化分页属性
        var options = {
            currentPage: currentPage,
            totalPages: totalPage,
            itemTexts: function (type, page, current) {
                switch (type) {
                    case "first":
                        return "首页";
                    case "prev":
                        return "上一页";
                    case "next":
                        return "下一页";
                    case "last":
                        return "末页";
                    case "page":
                        return page;
                }
            },
            tooltipTitles: function (type, page, current) {
                switch (type) {
                    case "first":
                        return "首页";
                    case "prev":
                        return "上一页";
                    case "next":
                        return "下一页";
                    case "last":
                        return "末页";
                    case "page":
                        return "第" + page + "页";
                }
            },
            onPageClicked: function (event, originalEvent, type, page) {
                // 点击链接时，应该重新加载数据
                loadingTable(selector, property, page);

            }
        }

        $('#' + pagination_div.id).bootstrapPaginator(options);

//		<div class="sdgrid-pager">
//			<div class="message" style="float:left;">共 <i class="blue">1256</i> 条记录，当前显示第 <i class="blue">1</i> 页</div>
//			<div id="sdgrid-page" style="float:right;"></div>
//		</div>
    }

})(jQuery);

/**
 * 自考平台左侧菜单显示插件
 * 功能：1) 显示属性手风琴菜单
 *       2) 点击收缩展开
 *       3) 提供默认展开 及 默认打开指定菜单
 *       4) 提供菜单加载完的回调封装
 *     5) 初始化时是否展开菜单
 *
 * @param $ jQuery选择器
 *
 * @author    wangbinbin
 * @date    2016/11/10
 */
(function ($) {

    $.fn.sdMenu = function (opt) {

        var _this = this;

        var defaults = {
            pClass: 'leftmenu',
            titleClass: 'title',
            titleNameClass: 'titleName',
            itemClass: 'menuson',
            activeItemClass: 'active',
            linkNameClass: 'linkName',
            target: 'contentFrame',
            expand: false,
            menus: [],
            defaultOpen: {pMenu: null, cMenu: null} // 默认打开菜单及页面序号
            , callback: null // 数据加载完的回调函数
        }

        var opts = $.extend(true, {}, defaults, opt);

        $(_this).empty();
        var menudl = document.createElement('dl');
        menudl.className = opts.pClass;

        for (var i = 0; i < opts.menus.length; i++) {

            var menu = opts.menus[i];

            var menuItemDd = document.createElement('dd');

            // 创建每一项菜单的title
            var menuItemTitle = document.createElement('div');
            menuItemTitle.className = opts.titleClass;

            var titleSpan = document.createElement('span');
            titleSpan.className = opts.titleNameClass;
            titleSpan.innerHTML = menu.name;
            menuItemTitle.appendChild(titleSpan);

            var titleImgSpan = document.createElement('span');
            var titleImg = document.createElement('img');
            titleImg.className = 'arrow';
            titleImg.src = '../images/arrow-right.png';
            titleImgSpan.appendChild(titleImg);
            menuItemTitle.appendChild(titleImgSpan);

            menuItemDd.appendChild(menuItemTitle)

            // 创建每一项菜单的子菜单
            var menuItemSub = document.createElement('ul');
            menuItemSub.className = opts.itemClass;

            if (opts.expand == false) {
                menuItemSub.style.display = 'none';
            } else {
                menuItemSub.style.display = '';
            }

            for (var j = 0; j < menu.subMenus.length; j++) {


                var menuItemSubItem = document.createElement('li');
                var cite = document.createElement('cite');
                menuItemSubItem.appendChild(cite);

                var link = document.createElement('a');
                link.className = opts.linkNameClass;
                link.href = menu.subMenus[j].link;
                link.target = opts.target;
                link.innerHTML = menu.subMenus[j].name;
                menuItemSubItem.appendChild(link);

                var iElement = document.createElement('i');
                menuItemSubItem.appendChild(iElement);

                menuItemSub.appendChild(menuItemSubItem);

            }
            menuItemDd.appendChild(menuItemSub);

            menudl.appendChild(menuItemDd);
        }
        _this[0].appendChild(menudl);

        if (sdutil.isFunction(opts.callback)) {
            opts.callback.call();
        }


        $(_this).find(".menuson li").click(function () {
            $(_this).find(".menuson li.active").removeClass("active")
            $(this).addClass("active");
        });

        $(_this).find('.title').click(function () {
            var $ul = $(this).next('ul');
            $(_this).find('dd').find('ul').slideUp();
            $(_this).find('.title').removeClass('titleactive');
            $(_this).find('.title').find('.arrow').attr('src', '../images/arrow-right.png');
            if ($ul.is(':visible')) {
                $(this).next('ul').slideUp(function () {

                });

            } else {
                $(this).next('ul').slideDown(function () {

                });

                $(this).addClass('titleactive');
                $(this).find('.arrow').attr('src', '../images/arrow-down-white.png');
            }

        });

        // 数据加载完后，执行回调
        if (sdutil.isFunction(opts.callback)) {
            opts.callback.call();
        }

        // 如果有设置默认打开，则执行默认打开页
        if (opts.defaultOpen && opts.defaultOpen.pMenu) {
            $(_this).find('.title:eq(' + (opts.defaultOpen.pMenu - 1) + ')').click();
        }

        if (opts.defaultOpen && opts.defaultOpen.cMenu) {
            $(_this).find('ul:visible').find('li:eq(' + (opts.defaultOpen.cMenu - 1) + ')').click();
            $(_this).find('ul:visible').find('li.active a')[0].click();
        }
    }

})(jQuery);


/**
 * sdSelect
 *    1、提供统一的select样式，
 *    2、效果增强
 *  3、方便与双向绑定插件整合
 *
 * @param $
 *
 * @author wangbinbin
 * @date 2016/11/14
 *
 */
(function ($) {

    $.sdSelect = function (opt) {

        var defaults = {
            ractive: null, // ractive对象，便于与业务系统整合，如果非ractive框架，此项无效设置
            callback: null
        }

        var opts = $.extend(true, {}, defaults, opt);

        // 监听页面是否有新添加select
        $('html').bind('DOMNodeInserted', function (e) {

            /*if($(e.target).is("select")) {

             initSdSelect(e.target,opts);
             }*/


            if ($(e.target).find('select').size() > 0) {
                $(e.target).find('select').each(function () {
                    initSdSelect(this, opts);
                });

                /*// 对新添加的select绑定监听事件
                 $(e.target).find('select').bind('DOMNodeInserted',function(e) {
                 initSdSelect(this,opts);
                 });*/

                $(e.target).find('select').unbind('DOMNodeRemoved');
                $(e.target).find('select').bind('DOMNodeRemoved', function (e) {

                    setTimeout(initSdSelectMonitor(this, opts), 50);
                });
            }
        });

        // 监听元素的select选项变化
        $('select').unbind('DOMNodeInserted');
        $('select').bind('DOMNodeInserted', function (e) {

            initSdSelect(this, opts);
        });
        // 监听元素的select选项变化
        $('select').unbind('DOMNodeRemoved');
        $('select').bind('DOMNodeRemoved', function (e) {

            setTimeout(initSdSelectMonitor(this, opts), 50);
        });

        $('select').each(function () {

            initSdSelect(this, opts);

        });


        function initSdSelectMonitor(currentSelect, opts) {

            return function () {
                initSdSelect(currentSelect, opts);
            }
        }

        function initSdSelect(currentSelect, opts) {

//			sdutil.defer(function(){

            var _this = currentSelect;

            $(_this).show(); // 先显示select，便于测量宽度
            var _width = $(_this).width();
            $(_this).hide(); // 获取完宽度后，隐藏

            var currentSelectName = $(_this).attr('sd-select');

            if (!currentSelectName) {

                var selectName = 'select' + new Date().getTime() + Math.random();
                $(_this).attr('sd-select', selectName);
                currentSelectName = selectName;
            }

            $(_this).next('.sdSelect-container').remove();

            var selectContainer = document.createElement('div');
            selectContainer.style.display = 'inline-block';
            selectContainer.className = 'sdSelect-container';

            // 创建输入框
            var selectInput = document.createElement('input');
            selectInput.className = 'sdui-select sdSelect-input';
            selectInput.name = currentSelectName + '-sdSelect';

            selectInput.style.width = (_width - 23) + 'px';
            selectInput.style.height = $(_this).height() + 'px';
            selectInput.style.textIndent = '0';
            selectInput.style.padding = '0 18px 0 5px';
            /* text-indent: 5px; */
            //selectInput.style.paddingRight = '10px';

            selectInput.readOnly = 'readonly';
            selectInput.disabled = $(_this).attr('disabled');

            $(selectContainer).append(selectInput);

            var selectItemContainer = document.createElement('ul');
            selectItemContainer.style.listStyle = 'none';
            selectItemContainer.style.margin = '0px';
            selectItemContainer.style.padding = '0px';
            selectItemContainer.style.maxHeight = '200px';
            selectItemContainer.style.overflowY = 'auto';
            selectItemContainer.style.overflowX = 'hidden';
            selectItemContainer.style.textAlign = 'left';

            selectItemContainer.style.width = _width + 'px';
            selectItemContainer.style.background = '#fff';

            selectItemContainer.style.border = '1px solid #e6e6e6';
            if ($(_this).css('border')) {
                selectItemContainer.style.border = $(_this).css('border');
            }
            selectItemContainer.style.zIndex = '9999';
            selectItemContainer.style.position = 'absolute';

            selectItemContainer.style.display = 'none'; // 下拉框默认不显示

            // 判断是否是多行选择框
            var isMultiple = false
            if (typeof($(_this).attr('multiple')) != "undefined") {
                isMultiple = true;
            }

            $(_this).children('option').each(function (index) {

                var selectItem = document.createElement('li');
                selectItem.style.padding = '0px 5px';
                selectItem.style.width = selectItemContainer.style.width;
                selectItem.style.display = 'block';
                selectItem.style.height = '2em';
                selectItem.style.lineHeight = '2em';
                selectItem.style.whiteSpace = 'nowrap';
                selectItem.style.overflow = 'hidden';
                selectItem.style.textAlign = 'left';
                selectItem.style.textOverflow = 'ellipsis';

                selectItem['setAttribute']('data', $(this).attr('value'));// 绑定option的value
                selectItem.title = $(this).text();   // 绑定title
                selectItem.innerHTML = $(this).text();   // 绑定option的下拉选项
                selectItemContainer.appendChild(selectItem);


            });

            $(selectContainer).append(selectItemContainer);
            $(_this).after(selectContainer);


            // initSelectedValue(_this,selectInput,isMultiple);
            bindDropdownListEvent(_this, selectInput, isMultiple);

            $(selectInput).click(function (e) {

                $('.sdSelect-container').find('ul').hide();

                $(this).next('ul').show();


                e.stopPropagation();
            });

            $(document).click(function () {
                $('.sdSelect-container').find('ul').hide();
            });


//			}, 1);

        }

        var sdSelectIntervalTime;


        function iterateSelect() {
            sdSelectIntervalTime = setInterval(function () {

                $('select').each(function () {
                    var _this = this;

                    // 判断是否是多行选择框
                    var isMultiple = false
                    if (typeof($(_this).attr('multiple')) != "undefined") {
                        isMultiple = true;
                    }


                    initSelectedValue(_this, $(_this).next("div.sdSelect-container").find("input.sdSelect-input")[0], isMultiple);
                });

            }, 50);
        }

        iterateSelect();

        function bindDropdownListEvent(_this, selectInput, isMultiple) {
            $(selectInput).next('ul').find('li').unbind('click');
            $(selectInput).next('ul').find('li').click(function (e) {

                $(selectInput).next('ul').find('li').removeClass('selected');

                if (!isMultiple) {

                    // 表示单选
                    /*$(_this).val($(this).attr('data'));*/

                    $('select[sd-select="' + $(_this).attr('sd-select') + '"]').val($(this).attr('data'));

                    var displayText = '';
                    $(selectInput).next('ul').find('li').each(function () {

                        if ($(this).attr('data') == $(_this).val()) {

                            $(this).addClass('selected');

                            displayText = $(this).text();

                        }
                    });
                    $(selectInput)[0].title = displayText;
                    $(selectInput).val(displayText);

                    $(selectInput).next('ul').hide();

                    // 执行回调函数
                    if (sdutil.isFunction(opts.callback)) {
                        opts.callback.call();
                    }

                } else {
                    // 多选
                    var mVals = $(_this).val();

                    if (mVals == null) {
                        mVals = new Array();
                    }


                    if (mVals.indexOf($(this).attr('data')) != -1) {

                        mVals.remove($(this).attr('data'));
                    } else {
                        mVals.push($(this).attr('data'));
                    }

                    $(_this).val(mVals);

                    var displayText = '';

                    for (var i = 0; i < mVals.length; i++) {
                        $(selectInput).next('ul').find('li').each(function () {
                            if ($(this).attr('data') == mVals[i]) {

                                $(this).addClass('selected');

                                if (displayText == '') {
                                    displayText += $(this).text();
                                } else {
                                    displayText += (' , ' + $(this).text());
                                }

                            }
                        });
                    }
                    $(selectInput)[0].title = displayText;
                    $(selectInput).val(displayText);

                    $(selectInput).next('ul').show();

                    // 执行回调函数
                    if (sdutil.isFunction(opts.callback)) {
                        opts.callback.call();
                    }
                }

                if (opts.ractive) {
                    opts.ractive.updateModel();

                    if (opts.ractive.find('select[sd-select="' + $(_this).attr('sd-select') + '"]')) { // 如果找不到，就不用触发change事件
                        var event = document.createEvent("HTMLEvents");
                        event.initEvent("change", true, false);
                        opts.ractive.find('select[sd-select="' + $(_this).attr('sd-select') + '"]').dispatchEvent(event);
                    }
                }

                // 这是对于普通jquery触发
                $(_this).trigger('change');

                e.stopPropagation();
            });
        }

        function initSelectedValue(_this, selectInput, isMultiple) {

            $(selectInput).next('ul').find('li').removeClass('selected');

            if ($(_this).is(':disabled')) {
                selectInput.disabled = 'disabled';
            } else {
                selectInput.disabled = '';
            }

            // 检查是否有验证不通过高亮
            if ($(_this).hasClass('error')) {
                $(selectInput).addClass('error');
            } else {
                $(selectInput).removeClass('error');
            }

            // 初始化值时，如果实际选项与sdSelect选项数不匹配，则再做一下option同步
            if ($(_this).find('option').text() != $(selectInput).next('ul').find('li').text()) {

                $(selectInput).next('ul').find('li').remove();

                $(_this).children('option').each(function (index) {

                    var selectItem = document.createElement('li');
                    selectItem.style.padding = '0px 5px';
                    selectItem.style.width = $(selectInput).next('ul').width() + 'px';
                    selectItem.style.display = 'block';
                    selectItem.style.height = '2em';
                    selectItem.style.lineHeight = '2em';
                    selectItem.style.whiteSpace = 'nowrap';
                    selectItem.style.overflow = 'hidden';
                    selectItem.style.textAlign = 'left';
                    selectItem.style.textOverflow = 'ellipsis';

                    selectItem['setAttribute']('data', $(this).attr('value'));// 绑定option的value
                    selectItem.title = $(this).text();   // 绑定title
                    selectItem.innerHTML = $(this).text();   // 绑定option的下拉选项
                    $(selectInput).next('ul').append(selectItem);
                });
                bindDropdownListEvent(_this, selectInput, isMultiple);
            }

            // 调整鼠标划过样式
            $(selectInput).next('ul').find('li').hover(function () {
                $(this).addClass('item-hover');
            }, function () {
                $(this).removeClass('item-hover');
            });

            if (!isMultiple) {

                // 表示单选
                var displayText = '';
                $(selectInput).next('ul').find('li').each(function () {

                    if ($(this).attr('data') == $(_this).val()) {

                        $(this).addClass('selected');

                        displayText = $(this).text();
                    }
                });

                $(selectInput)[0].title = displayText;
                $(selectInput).val(displayText);

            } else {
                // 多选
                var mVals = $(_this).val();

                var displayText = '';
                if (mVals) {
                    for (var i = 0; i < mVals.length; i++) {
                        $(selectInput).next('ul').find('li').each(function () {
                            if ($(this).attr('data') == mVals[i]) {

                                $(this).addClass('selected');

                                if (displayText == '') {
                                    displayText += $(this).text();
                                } else {
                                    displayText += (' , ' + $(this).text());
                                }

                            }
                        });
                    }
                }
                $(selectInput)[0].title = displayText;
                $(selectInput).val(displayText);
            }
        }
    }


})(jQuery);


/**
 *
 * 自定义tab组件，用于渲染tab风格页面显示
 *
 * @param $ jQuery选择器
 *
 * @author    wangbinbin
 * @date    2016/10/18
 */
(function ($) {
    var click_event = 'click';
    var enter_event = 'mouseenter';

    $.fn.sdTab = function (opts) {
        var _this = this;	// 指向当前选择器
        var isInit = false;	// 表示是否初始化
        var callbackXHistory = []; // 此数组用于防止执行历史，表明对应回调是否已经执行过


        var defaults = {
            type: 1, // 1：点击切换，2：滑过切换，3：自动切换
            duration: 200, // duration只有在type=2/type=3时有效，其他情况无需设置
            tabMenuClass: 'sdui-tab-menu',	// tab菜单默认的样式
            tabMenuActiveClass: 'active',	// tab当前菜单默认样式
            tabContentClass: 'sdui-tab-content',	// tab内容默认样式
            callbacks: [],	// 回调函数数组，对应每个tab显示时的回调函数，数组顺序与tab顺序一致
            callOnce: true	// 回调函数是否调用1次， 如果每次展示时都触发，则将此项置为false
        }

        var opts = $.extend(true, {}, defaults, opts);

        // 初始化tab显示
        initTabShow();

        var menu_event = click_event;

        switch (opts.type) {
            case 1:
                menu_event = click_event;
                break;
            case 2:
                menu_event = enter_event;
                break;
            case 3:
                break;
        }

        if (opts.type == 3) { // 自动播放

            var intertime = setInterval(autoSwitchTab, opts.duration);

            $(_this).hover(function () {
                clearInterval(intertime);
            }, function () {
                intertime = setInterval(autoSwitchTab, opts.duration);
            });

        } else { // 其他类型的切换方式
            $(_this).find('.' + opts.tabMenuClass).children().bind(menu_event, function (e) {
                // tab菜单点击，切换菜单样式
                if (menu_event == click_event) {
                    switchTab($(this));
                } else if (menu_event == enter_event) {
                    var hoverTime = setTimeout(switchTabWrap($(this)), opts.duration);

                    $(this).mouseout(function () {
                        clearTimeout(hoverTime);
                    });
                }
            });
        }

        /**
         * 初始化tab的显示
         */
        function initTabShow() {

            var currentMenu = null;

            if ($(_this).find('.' + opts.tabMenuClass).children('.' + opts.tabMenuActiveClass).length == 0) {
                currentMenu = $(_this).find('.' + opts.tabMenuClass).children().eq(0);

            } else {
                currentMenu = $(_this).find('.' + opts.tabMenuClass).children('.' + opts.tabMenuActiveClass).eq(0);
            }

            isInit = true;

            switchTab(currentMenu);
        }

        /**
         * 自动切换tab菜单
         */
        function autoSwitchTab() {

            // 切换菜单
            var currentActiveMenu = $(_this).find('.' + opts.tabMenuClass).children('.' + opts.tabMenuActiveClass);
            var toShowMenu = currentActiveMenu.next();

            if (toShowMenu.length == 0) {
                toShowMenu = $(_this).find('.' + opts.tabMenuClass).children().first();
            }

            // 切换content
            switchTab(toShowMenu);
        }


        /**
         * 此包装函数，用于setTimeout调用
         */
        function switchTabWrap(currentMenu) {

            return function () {
                switchTab(currentMenu);
            }
        }

        /**
         *  切换tab
         */
        function switchTab(currentMenu) {
            // 如果切换的选项还是当前的激活选项，则不应该做任何操作

            if (!currentMenu.hasClass('disabled')) {
                if ($(_this).find('.' + opts.tabMenuClass).children('.' + opts.tabMenuActiveClass).index() != currentMenu.index() || isInit == true) {

                    isInit = false;

                    currentMenu.siblings().removeClass(opts.tabMenuActiveClass);
                    currentMenu.addClass(opts.tabMenuActiveClass);

                    $(_this).find('.' + opts.tabContentClass).children().hide();
                    $(_this).find('.' + opts.tabContentClass).children().eq(currentMenu.index()).show();

                    // 执行各自回调函数
                    if (sdutil.isFunction(opts.callbacks[currentMenu.index()])) {

                        if (opts.callOnce != true || callbackXHistory[currentMenu.index()] != true) {
                            opts.callbacks[currentMenu.index()].call();		// 调用对应tab回调函数
                            callbackXHistory[currentMenu.index()] = true;	// 标记回调函数执行历史
                        }

                    }

                }
            }
        }
    }


})(jQuery);


/**
 * sdValidate目前是依赖jquery validate， 此插件进行了个性化封装
 *
 * @param $ jQuery选择器
 *
 * @author    wangbinbin
 * @date    2016/10/18
 */
(function ($) {

    $.fn.sdValidate = function (opts) {
        var _this = this;

        // 给待校验区域应用表单验证class
        $(_this).focus(true);		// 初始化时，光标置于第一个可输入框时，体验性不太好，此处设置焦点在form上
        $(_this).addClass('sd-validate');

        // 默认属性
        var defaults = {
            ignore: [],
            onkeyup: null,	// 关闭键盘事件
            onfocusin: null,	// 光标移入时，暂时不做效果
            focusInvalid: false, // true：光标定位到验证失败项，false：验证失败时，光标无需定位
            onfocusout: function (element) {
                var _theEle = this;

                // 移除验证样式
                $(element).removeClass('valid');
                $(element).removeClass('error');

                if (opts.focusout != false) { // 如果用户不指定为false，则默认执行 失去光标校验

                    if ($(element).hasClass('Wdate')) return;

                    if ($(element).hasClass('sdSelect-input') && $(element).parent().prev()[0]) {
                        element = $(element).parent().prev()[0];
                    }

                    sdutil.defer(function () {
                        _theEle.element(element);
                    }, 200);
                }
            },
            submitHandler: function () {
                if (opts.action && sdutil.isFunction(opts.action)) {
                    opts.action.call();
                }
            },
            showErrors: function (errorMap, errorList) {
                // 先移除所有error样式
                $(_this).find(".error").removeClass("error");

                for (var i = 0; i < errorList.length; i++) {

                    var invalidElementIndex = $("[name=" + "'" + errorList[i].element.name + "'" + "]").index($(errorList[i].element));

                    // 给invalid元素应用样式
                    $("[name=" + "'" + errorList[i].element.name + "'" + "]:eq(" + invalidElementIndex + ")").addClass("error");

                    // 判断是否设置了提示信息显示
                    if (opts.messageShow) {
                        // 提示信息是否需要显示
                        if (opts.messageShow.show && opts.messageShow.show == true) {

                            // 根据不同类型，显示对应风格样式
                            if (opts.messageShow.type == 1) {
                                // 默认显示
                                this.defaultShowErrors();

                            } else if (opts.messageShow.type == 2) {
                                // 警告框显示
                                alert(errorList[i].message);

                                break; // 对于警告框，应该只显示一个，多了体验性不好

                            } else if (opts.messageShow.type == 3) {

                                // 允许显示多个
                                var tipOpts = {tipsMore: true};

                                if ($("[name=" + "'" + errorList[i].element.name + "'" + "]:eq(" + invalidElementIndex + ")").attr("id")) {
                                    // tip方式显示
                                    tip(errorList[i].message, $("[name=" + "'" + errorList[i].element.name + "'" + "]:eq(" + invalidElementIndex + ")").attr("id"), tipOpts);
                                } else {
                                    message('警告：使用tip提示方式，元素必须要配置id属性！');
                                }

                            } else if (opts.messageShow.type == 4) {
                                // 吐司方式显示
                                message(errorList[i].message);

                                break; // 吐司应该一个一个显示
                            } else {
                                // 吐司方式显示
                                message(errorList[i].message);

                                break; // 吐司应该一个一个显示
                            }

                        }
                    }

                }


            }
        };
        // 合并校验属性
        var opts = $.extend(true, {}, defaults, opts);

        // 调用jquery validation插件
        $(_this).validate(opts);
    }

})(jQuery);

/**
 * checkbox的全选交互组件
 *
 * @author wangbinbin
 * @date 2016/11/1
 */
(function ($) {
    $.extend({
        sdCheckAll: function (opts) {

            var defaults = {
                pName: 'cb-all',
                cName: 'cb-item'
            }

            var mergedOpts = $.extend(true, {}, defaults, opts);

            // 监听全选项的change事件
            $('input[name=' + mergedOpts.pName + ']:checkbox').change(function () {

                var selectAllItemCB = false;

                if ($(this).is(':checked')) { // all选项如果是checked状态，则子checkbox都应该被选中
                    selectAllItemCB = true;
                }
                $('input[name=' + mergedOpts.cName + ']:checkbox').prop('checked', selectAllItemCB);
            });

            // 监听checkbox下的每一项change事件
            $('input[name=' + mergedOpts.cName + ']:checkbox').change(function () {

                var selectAllCB = false;
                // 如果选中的子选项与子选项个数一致，则应选中全选
                if ($('input[name=' + mergedOpts.cName + ']:checkbox').size() == $('input[name=' + mergedOpts.cName + ']:checkbox:checked').size()) {
                    selectAllCB = true;
                }

                $('input[name=' + mergedOpts.pName + ']:checkbox').prop('checked', selectAllCB);

            });
        }
    });

})(jQuery);

/**
 * 
 * sdTree 树型插件
 * 
 * @author wangbinbin
 * @date 2017/10/11
 * 
 */
;(function($,window,document,undefined){
	
	var Tree = function(options) {
		var that = this;
		
		that.options = options;
		
		var target = $(that.options.target);
		if(!target[0]) return;
	}
	
	Tree.prototype._load = function(){
		var that = this,options=that.options;
		
		if(options.type=='post' || options.type == 'POST') {
			options.contentType="application/json";
		}
		
		$.sdAjax({
			url: options.url,
			cache: options.cache,
			dataType: 'json',
			type: options.type,
			data: options.data,
			contentType: options.contentType,
			async: options.async,
			waitFlag:options.waitFlag,
			successCallback: function(data){
				if(data && data.success && data.data) {
					that._draw(data.data);
				}
			}
		});
	}
	
	Tree.prototype._draw = function(data,pnode,currentLevel) {
		var that = this,options=that.options;
		
		if(sdutil.isArray(data) && data.length>0) {
			var nodeContainer = '';
			
			if(!pnode) { // 表示根节点
				nodeContainer = $('<ul class="sdTree"></ul>')
				$(options.target).append(nodeContainer);
				$(options.target).append(nodeContainer);
			} else {
				nodeContainer = $('<ul class="ul-bg"></ul>');
				pnode.append(nodeContainer);
				pnode.find('.tree-icon').addClass('tree-icon-close');
				
				if(that.options.isExpandable == true) {
					nodeContainer.hide();
				} else {
					nodeContainer.show();
					pnode.find('.tree-icon').removeClass('tree-icon-close');
					pnode.find('.tree-icon').addClass('tree-icon-open');
				}
				
			}
			
			
			 if (currentLevel) {
                currentLevel += 1;
            } else {
                currentLevel = 1;
            }
			
			for(var i=0; i<data.length; i++) {
				
				var subNode = that._createNode(nodeContainer,currentLevel,data[i]);
				
				that._draw(data[i][options.childName],subNode,currentLevel);
			}
			
			
			if(options.style && options.style.select){ // 对于单选情况，按照正常情况，父节点不应该可以选择
				if(options.style.select.show==true && options.style.select.multiple!=true) {
					$(pnode).children('.tree-item').find('div.tree-check').hide();
				}
			}
		};
		
	}
	
	Tree.prototype._createNode = function(node,currentLevel,new_node_data,type) {
		
		var that = this, options=that.options;
		
		var tmp_current_node = node;
		var tmp_new_node = $('<li><div class="tree-icon"></div><div class="tree-item"><div class="tree-check"></div><div class="tree-title"></div></div></li>');
		
		if(type == 'after') {
			tmp_current_node.after(tmp_new_node);
		}else if(type == 'before') {
			tmp_current_node.before(tmp_new_node);
		}else if(type == 'child') {
			if(tmp_current_node.children('ul.ul-bg').size()>0) {
				tmp_current_node.children('ul.ul-bg').append(tmp_new_node);
				tmp_current_node.children('ul.ul-bg').show();
			}else{
				var nodeContainer = $('<ul class="ul-bg"></ul>');
				tmp_current_node.append(nodeContainer);
				nodeContainer.append(tmp_new_node);
				nodeContainer.show();
			}
			tmp_current_node.children('.tree-icon').removeClass('tree-icon-close');
			tmp_current_node.children('.tree-icon').addClass('tree-icon-open');
		}else{
			tmp_current_node.append(tmp_new_node);
		}
		
		// 判断是否显示展开/收缩图标
		options.style && options.style.icon && options.style.icon.show!=true && tmp_new_node.children('.tree-icon').hide();
		// 判断是否可以选中，以及选中效果
		if(options.style && options.style.select){
			if(options.style.select.show!=true) {
				tmp_current_node.find('.tree-check').hide(); // 不可选中
			}
		} 
		
		var _ndata = new_node_data || {};
		
		if(sdutil.isFunction(options.nodeId)) {
			tmp_new_node.attr('id',options.nodeId(_ndata));
			tmp_new_node.find('.tree-check').attr('id','tree-check-'+options.nodeId(_ndata))
		}
		
		var fields;
		if(new_node_data==null && sdutil.isArray(fields=options.fields)) {
			for(var i=0;i<fields.length;i++) {
				_ndata[fields[i].name] = '';
			}
		}
		
		tmp_new_node.data('ndata',_ndata);
		tmp_new_node.data('currentLevel',currentLevel);
		tmp_new_node.attr('currentLevel',currentLevel);
		
		var innerHTML = '';
		
		innerHTML = options.nodeInnerHtml.call('', _ndata);
		
		tmp_new_node.find('.tree-title').html(innerHTML);
		
		if(new_node_data==null && sdutil.isArray(fields=options.fields)) {
			for(var j=0;j<fields.length;j++) {
				tmp_new_node.find('.tree-title').find('[field="'+fields[j].name+'"]').html(fields[j].width?'<input type="text" name="'+fields[j].name+'" class="sdui-input" mandantory="'+fields[j].required+'" maxlength="'+fields[j].length+'" style="width:'+fields[j].width+'" value="" />':'<input type="text" name="'+fields[j].name+'" class="sdui-input" maxlength="'+fields[j].length+'"  value="" />');
			}
		}
		
		that._createToolbar(tmp_new_node); // 创建工具条
		
		tmp_new_node.find('.tree-item').hover(function(e){
			$('.sdTree-toolbar').hide();
			$(this).find('.sdTree-toolbar').show();
		},function(e){
//					sdutil.defer(function(){
				$('.sdTree-toolbar').hide();
//					},300);
			
		});
		
		tmp_new_node.find('.tree-icon').click(function(e){
			if(that.options.isExpandable == true) { // 只有可以收缩时，点击才有效果
				if($(this).hasClass('tree-icon-close')) {
					$(this).removeClass('tree-icon-close');
					$(this).addClass('tree-icon-open');
					
					$(this).siblings('ul.ul-bg').show();
				}else if($(this).hasClass('tree-icon-open')){
					$(this).removeClass('tree-icon-open');
					$(this).addClass('tree-icon-close');
					
					$(this).siblings('ul.ul-bg').hide();
				}
			}
			
			e.stopPropagation();
		});
		
		tmp_new_node.find('.tree-check').click(function(e){
			var _cnode = $(this).parents('li').eq(0);
			if($(this).hasClass('checked')){
				that._unselect(_cnode.attr('id'),_cnode);
			} else {
				that._select(_cnode.attr('id'),_cnode);
			}
			e.stopPropagation();
		});
		
		tmp_new_node.on('click',function(e){
			
			if(options.isNodeClickable==true) {
				$(this).children('.tree-item').find('.tree-check').click();
			}
			e.stopPropagation();
		});
		
		return tmp_new_node;
	};
	
	// 给指定节点创建工具条
	Tree.prototype._createToolbar = function($tree_node){
		var that = this, options = that.options;
		
		if(options.isEditable != true) return;
		
		
		var tool = $('<ul class="sdTree-toolbar" style="position: absolute;right: 5px;top: 4px;display:none;"><li class="edit" title="编辑"></li><li class="save" title="保存"></li><li class="delete" title="删除"></li><li class="insertAfter" title="添加结点（在下方）"></li><li class="insertBefore" title="添加结点（在上方）"></li><li class="insertChild" title="添加子节点"></li></ul>');
		$tree_node.find('.tree-item').append(tool);
		
		tool.data('currentLevel',$tree_node.data('currentLevel'));
		
		$tree_node.find('.sdTree-toolbar .edit').click(function(e){
				
			var fields,nodedata=$(this).parents('li').eq(0).data('ndata');

			if(sdutil.isArray(fields=options.fields)) {
				for(var j=0;j<fields.length;j++) {
					$(this).parent('ul.sdTree-toolbar').siblings('.tree-title').find('[field="'+fields[j].name+'"]').html(fields[j].width?'<input type="text" name="'+fields[j].name+'" class="sdui-input" mandantory="'+fields[j].required+'" maxlength="'+fields[j].length+'" style="width:'+fields[j].width+'" value="'+nodedata[fields[j].name]+'" />':'<input type="text" name="'+fields[j].name+'" class="sdui-input" maxlength="'+fields[j].length+'"  value="'+nodedata[fields[j].name]+'" />');
				}
			}
			
			that._changeToolbarMode(tool,'02');
			e.stopPropagation();
		});
		
		$tree_node.find('.sdTree-toolbar .save').click(function(e){
			var node=this;
			var currentnode=$(node).parents('li').eq(0),currentnodeData=currentnode.data('ndata'),pnode=currentnode.parents('li').eq(0),pass=true;
			
			currentnode.children('.tree-item').find('input').each(function(){
				var input = this;
				if($(input).attr('mandantory')=='true' && sdutil.trim($(input).val())=='') {
					$(input).addClass('error');
					
					if(options.requiredMsg) {
						
						if(options.requiredMsg.type==1) {
							alert(options.requiredMsg.msg);
						} else {
							message(options.requiredMsg.msg);
						}
						
					}
					pass=false;
				} else {
					$(input).removeClass('error');
					
					currentnodeData[$(input).attr('name')] = $(input).val();
				}
			});
			
			
			// 保存结点数据
			pass && sdutil.isFunction(options.saveNode) && options.saveNode.call('',currentnodeData,pnode.data('ndata'),function(data){
				
				currentnode.data('ndata',data);
				
				if(sdutil.isFunction(options.nodeId)) {
					currentnode.attr('id',options.nodeId(data));
					currentnode.find('.tree-check').attr('id','tree-check-'+options.nodeId(data))
				}
				
				$(node).parent('ul.sdTree-toolbar').siblings('.tree-title').html(options.nodeInnerHtml.call('', data));
			});
			
			if(!sdutil.isFunction(options.saveNode) && pass) {
				currentnode.data('ndata',currentnodeData);
				$(node).parent('ul.sdTree-toolbar').siblings('.tree-title').html(options.nodeInnerHtml.call('', currentnodeData));
			}
			
			
			if(pass) {
				// 保存后触发complete调用
				sdutil.isFunction(options.complete) && options.complete.call('',that._loadAllNodes(),that._loadSelectedNodes(),that._isEditing());
				
				that._changeToolbarMode(tool,'01');
			}
			
			e.stopPropagation();
		});
		
		$tree_node.find('.sdTree-toolbar .delete').click(function(e){
			var deleteBtn=this,node=$(deleteBtn).parents('li').eq(0);
			
			confirm('确定删除吗？',function(){
				if(node.siblings().size()<=0) {
					node.parents('ul').eq(0).siblings('.tree-icon').removeClass('tree-icon-close');
					node.parents('ul').eq(0).siblings('.tree-icon').removeClass('tree-icon-open');
				}
				
				that._remove(node.attr('id'),node)
				message('删除成功');
				// 保存后触发complete调用
				sdutil.isFunction(options.complete) && options.complete.call('',that._loadAllNodes(),that._loadSelectedNodes(),that._isEditing());
			});
			e.stopPropagation();
		});
		
		$tree_node.find('.sdTree-toolbar .insertAfter').click(function(e){
			var node=$(this).parents('li').eq(0);
			
			that._createNode(node,node.data('currentLevel'),null,'after');
			e.stopPropagation();
		});
		
		$tree_node.find('.sdTree-toolbar .insertBefore').click(function(e){
			var node=$(this).parents('li').eq(0);
			
			that._createNode(node,node.data('currentLevel'),null,'before');
			e.stopPropagation();
		});
		
		$tree_node.find('.sdTree-toolbar .insertChild').click(function(e){
			var node=$(this).parents('li').eq(0);
			
			if($(this).parent('ul.sdTree-toolbar').siblings('.tree-title').find('input').size()<=0) {
				that._createNode(node,node.data('currentLevel')+1,null,'child');
			}
			e.stopPropagation();
		});
		
		if(tool.siblings('.tree-title').find('input').size()<=0) {
			that._changeToolbarMode(tool,'01');
		} else {
			that._changeToolbarMode(tool,'02');
		}
	};
	
	Tree.prototype._changeToolbarMode = function($toolbar,type){
		var that=this;
		
		if(!$toolbar[0]) return;
		
		if(type == '01') {  // 编辑前的状态 / 保存后的状态
			$toolbar.children('.edit').show();
			$toolbar.children('.save').hide();
			$toolbar.children('.delete').show();
			$toolbar.children('.insertAfter').show();
			$toolbar.children('.insertBefore').show();
			$toolbar.children('.insertChild').show();
			
		} else if(type == '02') { // 编辑中状态
			$toolbar.children('.edit').hide();
			$toolbar.children('.save').show();
			$toolbar.children('.delete').show();
			$toolbar.children('.insertAfter').show();
			$toolbar.children('.insertBefore').show();
			$toolbar.children('.insertChild').hide();
		}
		// 树层级限制处理
		if(that.options.level && that.options.level <= $toolbar.data('currentLevel')) {
			$toolbar.children('.insertChild').hide();
		}
		
	}
	
	Tree.prototype._loadAllNodes = function() {
		var that = this, options = that.options;
		var extract = function(linode) {
            var datas = [], treeopen = false;

            linode.each(function () {

                var obj = $(this).data('ndata'), fields, cnodes;

                if (obj) {


                    if (sdutil.isArray(fields = options.fields)) {
                        for (var i = 0; i < fields.length; i++) {
                            if (obj.nodeadd) {
                                break;
                            }
                        }
                    }

                    cnodes = extract($(this).children('ul').children('li'));

                    if (obj[options.childName] && cnodes.length == 0) {
                        delete obj[options.childName];
                    } else if (cnodes.length) {
                        obj[options.childName] = cnodes;
                    }

                    datas.push(obj);
                }
            });

            return datas;
        }
		
		
		allNodes = extract($(that.options.target).find('ul.sdTree').children('li'));
		
		return allNodes;
	}
	
	Tree.prototype._isEditing = function() {
		var that = this;
		return $(that.options.target).find('input').size()>0?true:false;
	}
	
	Tree.prototype._loadSelectedNodes = function(target){
		var that = this,selectedNodes=[];
		target = target || that.options.target;
		
		$(target).find('div.tree-check.checked').each(function(e){
			if($(this).parents('li:eq(0)').children('ul').size()<=0 || $(this).parents('li:eq(0)').children('ul').children('li').size()<=0) {
				selectedNodes.push($(this).parents('li:eq(0)').data('ndata'));
			}
		});
		
		return selectedNodes;
	}
	
	Tree.prototype._select = function(id,node,enableClick) {
		var that = this,options=that.options,multiSelection=true;
		
		if(options.style && options.style.select){
			if(options.style.select.show==true && options.style.select.multiple!=true) {
				multiSelection = false;
				$(options.target).find('div.tree-check').removeClass('checked');
			}
		} 
		
		if(id) {
			
			$(options.target).find('[id="tree-check-'+id+'"]').removeClass('checked');
			$(options.target).find('[id="tree-check-'+id+'"]').addClass('checked');
			
			if(multiSelection==true) {
				$(options.target).find('li[id="'+id+'"]').find('ul div.tree-check').removeClass('checked');
				$(options.target).find('li[id="'+id+'"]').find('ul div.tree-check').addClass('checked');
			}
			
			node = $(options.target).find('li[id="'+id+'"]');
		} else {
			
			node.find('div.tree-check').removeClass('checked').addClass('checked');
		}
		
		node.find('div.tree-check').each(function(e){
			if($(this).hasClass('checked')) {
				$(this).parents('.tree-item').eq(0).removeClass('checked').addClass('checked');
			}
		});
		
		
		var selectParent = function(linode){
			
			if(linode.siblings('li').children('.tree-item.checked').size()>=0 && linode.siblings('li').children('.tree-item.checked').size() == linode.siblings('li').size()) {
				linode.parents('li:eq(0)').children('.tree-item').removeClass('checked').addClass('checked');
				linode.parents('li:eq(0)').children('.tree-item').children('div.tree-check').removeClass('checked').addClass('checked');
				
				linode.siblings('li').children('.tree-item.checked').size()>0 && selectParent(linode.parents('li:eq(0)'));
			}
		};
		
		selectParent(node);
		
		if(enableClick!=false) {
			sdutil.isFunction(options.nodeClick) && options.nodeClick.call('',0,node.data('ndata'),that._loadSelectedNodes(node),that._loadSelectedNodes());
		}
	}
	
	Tree.prototype._unselect = function(id,node,enableClick) {
		var that = this;
		
		if(id) {
			node = $(that.options.target).find('li[id="'+id+'"]');
		} else {
			node.find('div.tree-check').removeClass('checked');
		}
		
		var _op_nodes = that._loadSelectedNodes(node);
		
		if(id) {
			$(that.options.target).find('[id="tree-check-'+id+'"]').removeClass('checked');
			$(that.options.target).find('li[id="'+id+'"]').find('ul div.tree-check').removeClass('checked');
		}
		
		node.find('div.tree-check').each(function(e){
			$(this).parents('.tree-item').eq(0).removeClass('checked');
		});
		
		// 取消所有父节点的选中效果
		node.parents('li').children('.tree-item').children('div.tree-check').removeClass('checked');
		node.parents('li').children('.tree-item').removeClass('checked');
		
		if(enableClick!=false) {
			sdutil.isFunction(that.options.nodeClick) && that.options.nodeClick.call('',1,node.data('ndata'),_op_nodes,that._loadSelectedNodes());
		}
	}
	
	Tree.prototype._remove = function(id,node) {
		var that = this;
		
		if(id) {
			$(that.options.target).find('li[id="'+id+'"]').remove();
		} else {
			node.remove();
		}
	}
	
	Tree.prototype._openlevel = function(level) {
		var that=this;
		if(level*1<=0) return;
		
		
		if(that.options.isExpandable == true) { // 只有可以收缩时，点击才有效果
			for(var i=0;i<level;i++) {
				$(that.options.target).find('li[currentLevel="'+(i+1)+'"]').each(function(e){
					var _t_icon = $(this).children('.tree-icon');
					if(_t_icon.hasClass('tree-icon-close')) {
						_t_icon.removeClass('tree-icon-close');
						_t_icon.addClass('tree-icon-open');
						
						_t_icon.siblings('ul.ul-bg').show();
					}else if(_t_icon.hasClass('tree-icon-open')){
						_t_icon.removeClass('tree-icon-open');
						_t_icon.addClass('tree-icon-close');
						
						_t_icon.siblings('ul.ul-bg').hide();
					}
				});
			}
			
		}
		
	}
	
	Tree.prototype._close = function(id,node) {
		
	}
	
	$.fn.sdTree = function(opts,nodes) {
			
			var _this = this;
			
			// tree默认属性
			var defaults = {
				isEditable:false
				,isNodeClickable:false   //结点内容是否可点击
				,defaultBtnText:'添加'
				,level:null // 结点层数， 此参数只在编辑情况下有效
				,style:{
					icon:{ // icon样式 TODO，后期可增强图标显示控制
						show:true  // true：显示树型结构图标，false：不显示图标
					}
					,select:{ // 选中效果控制，TODO，后期可增强选中效果
						show:true // 是否显示选中效果
						,multiple:false
					}
				}
				,isExpandable:true  // 是否可以展开，true: 可展开，则默认是收缩状态， 否则是展开状态
				,fields:[{name:'title',width:'',length:''},{name:'date',width:'',length:''}]
				,fieldKeyup:function(val){
					
				}
				,childName: 'childNodes'
				,nodeId:function(data) {
					// 此方法用于生成每一个节点的id， 如果需要外部调用(删除/选择 等操作)，请务必设置，以便操作对应业务数据节点
					// 返回唯一标识
					// 比如：return data.id;
					return null;
				}
				,nodeInnerHtml:function(data) {
					// 覆写此方法，用于渲染tree的显示
					
					// return的内容作为页面显示
					return '';
				}
				,nodeClick:function(type,data,nodes,selectedNodes) {
					// type: 0  表示选中， 1表示取消选中  ， data： 当前结点数据，  nodes： 选中的节点数据/被取消选中的节点数据, selectedNodes: 当前tree当中所有选中的节点数据
					// 覆写此方法，用于渲染tree结点的点击回调，使用者可以直接操作此条记录
				}
				,complete: function(datas,selectedNodes) {
					// tree上的全部数据集
					
				}
				,saveNode:null
				//saveNode:function(node,pnode,render){
					// saveNode是一个回调函数，格式：参数node表示当前结点数据，pnode是当前结点父节点数据，render是保存成功后的回调函数，function(node,callback) { callback.call(this,{name:'xxx'}); }
				//}
			};
			
			defaults.selectedNodes = [];
			
			opts = $.extend(true,{},defaults, opts);
			opts = opts || {}, opts.target = this[0];
			
			var tree = new Tree(opts);
			
			
			if(sdutil.isArray(nodes)) {
				tree._draw(nodes);
			} else {
				tree._load();
			}
			
			return {
				select:function(id,enableClick) {
					tree._select(id,null,enableClick)
				}
				,unselect:function(id,enableClick){
					tree._unselect(id,null,enableClick);
				}
				,remove:function(id){
					tree._remove(id);
				}
				,openlevel:function(level){
					tree._openlevel(level);
				}
			};
		}
	
})(jQuery,window,document);


/**
 * 自动完成插件，方便项目完成自动联想下拉框
 * @param $
 *
 * @author wangbinbin
 * @date 2016/12/02
 */
(function ($) {

    var AutoComplete = function (options) {

        this.options = options;
        this._container = null;

        var target = $(options.target);
        if (!target[0]) return;

        this._target = target;
    };

    AutoComplete.prototype._load = function () {
        var that = this, property = this.options;
        if (property.type == 'post' || property.type == 'POST') {
            property.contentType = "application/json";
        }

        $.sdAjax({
            url: property.url,
            cache: property.cache,
            dataType: 'json',
            type: property.type,
            data: property.data,
            contentType: property.contentType,
            async: property.async,
            waitFlag: property.waitFlag,
            successCallback: function (data) {
                if (data && data.isSuccess && data.data) {
                    that._draw(data.data)
                }
            }
        });
    };

    AutoComplete.prototype._draw = function (datas) {

        var that = this;

        var ul = $('<ul class="sdui-autocomplete"></ul>');

        $('body').append(ul);

        ul.css('width', that._target.width() + 'px');


        /*if(that._target.css('border')) {
         ul.css('border',that._target.css('border'));
         }*/

        ul.css('zIndex', new Date().getTime());

        if (sdutil.isArray(datas)) {
            for (var i = 0; i < datas.length; i++) {
                var selectItem = $('<li></li>');

                selectItem.css('width', ul.width() + 'px');
                selectItem.html(that.options.innerHtml.call('', datas[i]));
                selectItem.data('data', datas[i]);
                ul.append(selectItem);
            }
        }

        $('body').append(ul);

        that._container = ul;
        that._render();
    };

    AutoComplete.prototype._render = function () {
        var that = this;

        that._container.find('li').click(function () {
            that._target.val($(this).text());
            sdutil.isFunction(that.options.itemClick) && that.options.itemClick.call(this, $(this).data('data'));
        });

        $(document).click(function () {
            $('ul.sdui-autocomplete').hide();
        });

        that._target.keyup(function () {
            that._container.show();
            that._container.children('li').hide();
            that._target.val() && that._container.children('li:contains("' + that._target.val() + '")').size() > 0 && that._container.children('li:contains("' + that._target.val() + '")').show() || that._target.val() && that._container.children('li:contains("' + that._target.val() + '")').size() == 0 && that._container.hide() || !that._target.val() && that._container.hide();
            
            if(that._container.children('li:contains("' + that._target.val() + '")').size() <= 0){
            	if(that._container.find('li.norecord').size()==0) {
            		that._container.append('<li class="norecord" style="width:'+that._container.width()+'px">无匹配记录</li>');
            	} else {
            		that._container.find('li.norecord').show();
            	}
            	
            	that._container.show();
            }else{
            	that._container.find('li.norecord').remove();
            }
        });
        
        var target_value = '';
        that._target.focusin(function(){
        	target_value = that._target.val();
        	/*if(that.options.clear==true) {
        		that._target.val('');
        	}*/
        });
        
        that._target.focusout(function(){
        	if(that.options.clear==true && that._target.val()!=target_value) {
        		that._target.val('');
        	}
        });
        
        /*that._target.blur(function(){
        	if(that.options.clear==true) {
        		that._target.val('');
        	}
        });*/

        setInterval(function () {
            that._container.css({
                left: that._target.offset().left,
                top: that._target.offset().top + that._target.height() + 5
            });
        }, 50);
    }

    // 自动完成插件
    $.fn.sdAutoComplete = function (opts, datas) {

        var me = this;

        var defaults = {
        	clear:true,  // 没找到匹配记录时，是否清空输入表单域
            innerHtml: function (data) {
                // 这里边可以自定义html代码，具体参考sdGrid或sdTree用法
                return '';
            }
            , itemClick: function (data) {
                //点击item获取当前记录
            }
        }

        var options = $.extend(true, {}, defaults, opts);

        options = options || {}, options.target = this[0];


        if (sdutil.isArray(datas)) {
            var autoComplete = new AutoComplete(options);
            autoComplete._draw(datas);
        } else {
            var ajaxDefaults = {
                url: '',
                type: 'GET',
                async: true,	// 是否异步 
                data: {},  	// 待发送数据
                waitFlag: true, //是否显示等待动画
                lazy: false, // true：表示懒加载，点击展开时，才会加载， false：表示初始化时后续数据已经加载完毕了 TODO
            };

            options = $.extend(true, {}, ajaxDefaults, options);

            var autoComplete = new AutoComplete(options);
            autoComplete._load();
        }
    }
})(jQuery);


/**
 * sdScroller 滚动条滚动加载数据（自动加载 或 手动点击加载更多）
 *
 * @author wangbinbin
 * @date 2017/09/04
 *
 */
;
(function ($, window, document, undefined) {


    var Scroller = function (options) {
    };

    Scroller.prototype.load = function (options) {
        var me = this, timer, isFinished = false, curr_page = 0;
        options = options || {};

        // 检查scroller作用域，如果不存在则退出
        var target = $(options.target);
        if (!target[0]) return;

        var bottom = options.bottom || 50;

        var LOAD_MORE_TEXT = "<cite class='loadmore'>加载更多</cite>";
        var LOADING_TEXT = "<cite class='loading'></cite>";
        var NO_MORE = "<cite class='nomore'>没有更多了</cite>";

        var more_bar = $("<div class='sdui-scroller-more'><a href='javascript:;'>" + LOAD_MORE_TEXT + "</a></div>");
        target.append(more_bar);

        // 绑定点击事件
        more_bar.find('cite.loadmore').on('click', function () {

            // 执行请求
            curr_page++;
            doRequest(options, curr_page);
        });

        /**
         * 渲染数据
         * @param {Object} newhtml 当前待渲染的html片段
         * @param {Object} isFinish 是否停止加载
         */
        var render = function (newhtml, isFinish) {

            // 插入新加载的内容
            more_bar.before(newhtml);
            // 
            isFinish = isFinish == true ? isFinish : false;
            if (isFinish) {
                more_bar.find('a').html(NO_MORE);
            } else {
                more_bar.find('a').html(LOAD_MORE_TEXT);

                // 绑定点击事件
                more_bar.find('cite.loadmore').on('click', function () {

                    // 执行请求
                    curr_page++;
                    doRequest(options, curr_page);
                });
            }


            isFinished = isFinish;
        };
        /**
         * 构建请求后台函数
         * @param {Object} property
         * @param {Object} currentPage
         */
        var doRequest = function (property, currentPage) {

            // 使用加载动画，表示加载中...
            more_bar.find('a').html(LOADING_TEXT);

            var tmpurl = property.url;

            var pageSize = 10;
            if (property.pageSize) {
                pageSize = property.pageSize;
            }

            // GET请求，应该是在路径后拼接
            if (property.type == 'get' || property.type == 'GET') {
                if (property.url) {
                    if (property.url.indexOf('?') > 0) {
                        tmpurl += ('&page=' + currentPage + '&pageSize=' + pageSize);
                    } else {
                        tmpurl += ('?page=' + currentPage + '&pageSize=' + pageSize);
                    }
                }

            } else {
                property.data['page'] = currentPage;
                property.data['pageSize'] = pageSize;
                property.contentType = "application/json";
            }

            $.sdAjax({
                url: tmpurl,
                cache: property.cache,
                dataType: 'json',
                type: property.type,
                data: property.data,
                contentType: property.contentType,
                async: property.async,
                waitFlag: false,
                successCallback: function (data) {
                    if (data && data.success) {
                        typeof property.successCB === 'function' && property.successCB(data.data, render, curr_page);
                    } else {
                        // 其他情况代表出错
                        curr_page--;
                        typeof property.errorCB === 'function' && property.errorCB();
                        setTimeout(function () {
                            render('', false);
                        }, 1000);
                    }
                },
                errorCallback: function (e) {
                    curr_page--;

                    /*setTimeout(function(){
                     property.successCB(null,render,curr_page);
                     },1000);*/


                    typeof property.errorCB === 'function' && property.errorCB(e);
                    setTimeout(function () {
                        render('', false);
                    }, 1000);
                }
            });
        };
        // 默认执行一次请求
        curr_page++;
        doRequest(options, curr_page);

        if (!options.isAuto) return;
		
		var scrollerTarget = null;
		if(options.scrollerTarget!=null) {
			scrollerTarget = $(options.scrollerTarget);
		} else {
//			scrollerTarget = target;
			// TODO
			scrollerTarget = $(window);
		}

        scrollerTarget.on('scroll', function () {
            var that = $(this), top = that.scrollTop();

            if (timer) clearTimeout(timer);
            if (isFinished) return;

            timer = setTimeout(function () {
                //计算滚动所在容器的可视高度
                var height = scrollerTarget ? that.height() : $(window).height();

                //计算滚动所在容器的实际高度
                var scrollHeight = scrollerTarget ? scrollerTarget.prop('scrollHeight') : document.documentElement.scrollHeight;
				
				if(!scrollerTarget.prop('scrollHeight')) {
					scrollHeight = document.documentElement.scrollHeight;
				}
				
                //临界点
                if (scrollHeight - top - height <= bottom) {
                    curr_page++;
                    doRequest(options, curr_page);
                }
            }, 200);
        });
    };

    /**
     * 基于jQuery扩展定义 sdScroller，用于浏览器滚动条滚动加载数据
     * @param {Object} opts
     */
    $.fn.sdScroller = function (opts) {

        if (!this[0]) return;

        var defaultOptions = {
        	scrollerTarget:null, // 如果不特别指定，以当前容器为基准滚动计算
            url: '',
            cache: false,
            type: 'GET',
            pageSize: 10, // 每页请求数量
            isAuto: true, // 是否为自动加载，true:自动加载， false:手动加载
            bottom: 50,	// 滚动条距离底部多少像素时自动加载  , 只有 isAuto==true时才有效
            async: true,	// 是否异步 
            data: {},  	// 待发送数据
            successCB: function (data, render, cpage) {
                // data   此次请求 返回的结果集
                // render 是一个function，目前共有两个参数，第一个参数：新数据html片段，第二个参数：是否加载完成（true or false）
                // cpage  当前加载的页码
                // 数据加载成功后，希望执行的操作

            }
            , errorCB: function (error) {
                // 数据加载失败后，希望执行的操作

            }
        }

        opts = $.extend(true, {}, defaultOptions, opts);

        opts = opts || {}, opts.target = this[0];


        var sdScroller = new Scroller();
        sdScroller.load(opts);
    };


})(jQuery, window, document);


/**
 * 简单上传器
 */
;
(function ($, window, document, undefined) {

    var SimpleUploader = function (options) {
        var that = this;

        that.uploadList = [];
    };

    SimpleUploader.prototype.init = function (options) {
        var that = this, initNum = 0;

        options = options || {};

        options.type = options.type || {name: 'image', ext: 'BMP|JPEG|JPG|PNG|GIF'};
        var SUPPORT_FILE_EXTENSION = 'BMP|JPEG|JPG|PNG|GIF';
        var SUPPORT_IMAGE_EXTENSION = 'BMP|JPEG|JPG|PNG|GIF|DOC|PPT|DOCX|PPTX|SWF|AVI';

        // 检查uploader作用域，如果不存在则退出
        var target = $(options.target);
        if (!target[0]) return;


        target.removeAttr('multiple'); // 禁用多文件上传

        if (options.type.name == 'image') {

            var acceptExt = '';

            if (options.type.ext) {
                var uExtensions = options.type.ext.split('|');
                for (var i = 0; i < uExtensions.length; i++) {
                    if (acceptExt.length > 0) acceptExt += ',';
                    acceptExt += that._isSupportImage(uExtensions[i]);
                }
            }

            if (acceptExt.length == 0) {
                acceptExt = 'image/*';
            }

            target.attr('accept', acceptExt);

        } else if (options.type.name == 'file') {

            var acceptExt = '';
            if (options.type.ext) {

                var uExtensions = options.type.ext.split('|');
                for (var i = 0; i < uExtensions.length; i++) {
                    if (acceptExt.length > 0) acceptExt += ',';
                    acceptExt += that._isSupportFile(uExtensions[i]);
                }
            }

            target.attr('accept', acceptExt);
        }

        // 获取文件路径
        var parseFilePath = function (file) {
            var filePath = "";
            try {

                try {
                    filePath = file.getAsDataURL();
                } catch (e) {
                    filePath = window.URL.createObjectURL(file);
                }
            } catch (e) {
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        filePath = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            }

            return filePath;
        };

        // 上传按钮添加change事件
        target.on('change', function (e) {
            //e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
            /*lastModified: 1502957234051
             lastModifiedDate: Thu Aug 17 2017 16:07:14 GMT+0800 (中国标准时间)
             name: "599144e3Ndede54a2.jpg"
             size: 87446
             type: "image/jpeg"
             webkitRelativePath: ""*/
            if (e.currentTarget.files) {

                for (var i = 0; i < e.currentTarget.files.length; i++) {
                    var file = null;
                    if (e.currentTarget.files && e.currentTarget.files[i]) {
                        file = e.currentTarget.files[i];
                    } else if (e.currentTarget.files && e.currentTarget.files.item(i)) {
                        file = e.currentTarget.files.item(i);
                    }

                    if (options.size && options.size > 0) {

                        if (file.size > options.size) {
                            // 提示错误信息
                            continue;
                        }
                    }

                    if (options.cropper == true) {

                        $.sdCropper({
                            image: parseFilePath(file),
                            ok: function (dataURL, blob) {

                                console.log('裁剪完成==============>>>>>>');
                                console.log(dataURL);

                                that.upload(blob, options);
                            }
                        });

                    } else {
                        that.upload(file, options);
                    }
                }
            }

            target.val("");
        });
    };

    SimpleUploader.prototype.upload = function (file, options) {
        var that = this;

        options = options || {};
        options.fieldName = options.fieldName || 'files';

        var uploadData = new FormData();

        if (options.cropper == true) {
            uploadData.append(options.fieldName, file, Date.parse(new Date()) + '.png');
        } else {
            uploadData.append(options.fieldName, file);
        }
        var xhr;

        try {	//IE7+、Chrome、Firefox、Opera8.0+和Safari  
            xhr = new XMLHttpRequest();
        } catch (e) {
            try {//IE7+  
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {//IE5、6  
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                }
            }
        }

        // 监听当前进度
        xhr.upload.addEventListener("progress", function (e) {
            that._progress(options, file, e.loaded, e.total);
        }, false);

        // 监听上传完成
        xhr.addEventListener("load", function (e) {

            if (xhr.responseText) {
                // 回调到外部
                that._success(options, file, xhr.responseText);
            } else { // 如果返回的是空内容, 对应用来说就是上传失败
                that._failure(options, file, xhr.responseText);
            }
        }, false);

        // 监听错误事件
        xhr.addEventListener("error", function (e) {
            // 回调错误处理
            that._failure(options, file, xhr.responseText);
        }, false);

        xhr.open("POST", options.uploadUrl, true);
//		xhr.setRequestHeader("X_FILENAME", file.name);
        xhr.send(uploadData)

    };

    SimpleUploader.prototype._transferFileExtension = function (mediatype) {
        var that = this;

        var extension = '';

        switch (mediatype) {
            case 'image/bmp':
                extension = 'BMP';
                break;
            case 'image/gif':
                extension = 'GIF';
            case 'image/jpeg':
                extension = 'JPEG';
                break;
            case 'image/jpg':
                extension = 'JPG';
                break;
            case 'image/png':
                extension = 'PNG';
                break;
            default:
                break;
        }

        return extension;
    }

    SimpleUploader.prototype._isSupportImage = function (extension) {
        var that = this;

        var mediaType = '';

        if (extension) {
            switch (extension.toUpperCase()) {
                case 'BMP':
                    mediaType = 'image/bmp';
                    break;
                case 'GIF':
                    mediaType = 'image/gif';
                case 'JPEG':
                    mediaType = 'image/jpeg';
                    break;
                case 'JPG':
                    mediaType = 'image/jpg';
                    break;
                case 'PNG':
                    mediaType = 'image/png';
                    break;
                default:
                    break;
            }
        }

        return mediaType;
    }

    SimpleUploader.prototype._isSupportFile = function (extension) {
        var that = this;

        var mediaType = '';

        if (extension) {
            /** switch (extension.toUpperCase()){
				case 'TXT':
					mediaType = 'text/plain';
					break;
				case 'WPS':
					mediaType = 'application/vnd.ms-works';
				case 'WDB':
					mediaType = 'application/vnd.ms-works';
					break;
				case 'XLS':
					mediaType = 'application/vnd.ms-excel';
					break;
				case 'ZIP':
					mediaType = 'aplication/zip';
					break;
				case 'BMP':
					mediaType = 'image/bmp';
					break;
				case 'GIF':
					mediaType = 'image/gif';
				case 'JPEG':
					mediaType = 'image/jpeg';
					break;
				case 'JPG':
					mediaType = 'image/jpg';
					break;
				case 'PNG':
					mediaType = 'image/png';
					break;
				case 'MP4':
					mediaType = 'audio/mp4,video/mp4';
					break;
				case 'MP3':
					mediaType = 'audio/mpeg';
					break;
				case 'DOC':
					mediaType = 'application/msword';
					break;
				case 'CSS':
					mediaType = 'text/css';
					break;
				case 'CSS':
					mediaType = 'text/css';
					break;
				default:
					break;
			}*/
        }

        return mediaType;
    }


    SimpleUploader.prototype._indexOf = function (file) {
        var that = this;

        var index = -1;
        for (var i = 0; i < that.uploadList.length; i++) {
            if (that.uploadList[i] == file) {
                index = i;
                break;
            }
        }

        return index;
    }

    /* 上传进度系统内部回调 */
    SimpleUploader.prototype._progress = function (options, file, loaded, total) {
        var that = this;

        var target = $(options.target);
        if (!target[0]) return;

    };

    /* 上传成功系统内部回调 */
    SimpleUploader.prototype._success = function (options, file, responseText) {
        var that = this;

        var target = $(options.target);
        if (!target[0]) return;

        options.uploadedCB(responseText);

    };

    /* 上传失败系统内部回调 */
    SimpleUploader.prototype._failure = function (options, file, responseText) {
        var that = this;

        var target = $(options.target);
        if (!target[0]) return;

    };

    /* 上传完成系统内部回调 */
    SimpleUploader.prototype._complete = function (options, files) {

        var that = this, finishFiles = [];


    };


    $.fn.sdSimpleUploader = function (options) {
        var _this = this;

        if (!this[0]) return;

        var defaultOptions = {
            uploadUrl: '',
            type: {
                name: 'image'  // 定义上传类型,  image: 表示只上传图片,  file: 上传各种类型文件
                , ext: ''  // 对于 file类型，目前不做扩展名限制， image类型，目前只支持：BMP、GIF、JPEG、JPG、PNG
            },
            cropper: false, // 是否需要裁剪，此属性
            size: null,// // 文件最大大小
            uploadedCB: function (response) {

            }
        }

        options = $.extend(true, {}, defaultOptions, options);

        options = options || {}, options.target = this[0];

        // 新建上传器，用于执行上传
        var simpleUploader = new SimpleUploader();
        simpleUploader.init(options);
    }

})(jQuery, window, document);


/**
 * sdUploader 集图片上传及预览于一体，提供一体化解决方案
 *
 * @author wangbinbin
 * @date 2017/09/04
 */
;
(function ($, window, document, undefined) {

    var Uploader = function (options) {
        var that = this;

        that.uploadList = [];
        that.successList = [];
        that.flagList = [];
    };

    Uploader.prototype.init = function (options) {
        var that = this, initNum = 0;

        options = options || {};

        options.text = options.text || '选择文件';

        options.type = options.type || {name: 'image', ext: 'BMP|JPEG|JPG|PNG|GIF'};
        var SUPPORT_FILE_EXTENSION = 'BMP|JPEG|JPG|PNG|GIF';
        var SUPPORT_IMAGE_EXTENSION = 'BMP|JPEG|JPG|PNG|GIF|DOC|PPT|DOCX|PPTX|SWF|AVI';

        // 检查uploader作用域，如果不存在则退出
        var target = $(options.target);
        if (!target[0]) return;

        if (options.type.name == 'image' && options.cropper == true) {
            target.removeAttr('multiple'); // 禁用多文件上传
        }
        //target.removeAttr('multiple'); // 禁用多文件上传

        if (options.type.name == 'image') {

            var acceptExt = '';

            if (options.type.ext) {
                var uExtensions = options.type.ext.split('|');
                for (var i = 0; i < uExtensions.length; i++) {
                    if (acceptExt.length > 0) acceptExt += ',';
                    acceptExt += that._isSupportImage(uExtensions[i]);
                }
            }

            if (acceptExt.length == 0) {
                acceptExt = 'image/*';
            }

            target.attr('accept', acceptExt);

        } else if (options.type.name == 'file') {

            var acceptExt = '';
            if (options.type.ext) {

                var uExtensions = options.type.ext.split('|');
                for (var i = 0; i < uExtensions.length; i++) {
                    if (acceptExt.length > 0) acceptExt += ',';
                    acceptExt += that._isSupportFile(uExtensions[i]);
                }
            }

            target.attr('accept', acceptExt);
        }

        // 上传按钮添加change事件
        target.on('change', function (e) {
            //e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
            /*lastModified: 1502957234051
             lastModifiedDate: Thu Aug 17 2017 16:07:14 GMT+0800 (中国标准时间)
             name: "599144e3Ndede54a2.jpg"
             size: 87446
             type: "image/jpeg"
             webkitRelativePath: ""*/
            if (e.currentTarget.files) {
            	
            	options.completeCB(that.successList, false);

                for (var i = 0; i < e.currentTarget.files.length; i++) {
                    var file = null;
                    if (e.currentTarget.files && e.currentTarget.files[i]) {
                        file = e.currentTarget.files[i];
                    } else if (e.currentTarget.files && e.currentTarget.files.item(i)) {
                        file = e.currentTarget.files.item(i);
                    }

                    if (options.num) {

                        if (that.uploadList.length >= options.num) {
                            continue;
                        }

                    }

                    if (options.size && options.size > 0) {

                        if (file.size > options.size) {
                            // 提示错误信息
                            target.prev('div.sdui-uploader-container').find('.sdui-uploader-message cite').html('文件大小超过限制');
                            target.prev('div.sdui-uploader-container').find('.sdui-uploader-message').show();

                            setTimeout(function () {
                                target.prev('div.sdui-uploader-container').find('.sdui-uploader-message').fadeOut(2000);
                            }, 2000);
                            continue;
                        }
                    }
                    that.uploadList.push(file);

                    if (options.num && options.num > 0) {
                        target.prev('div.sdui-uploader-container').find('.sdui-uploader-select i').text(' (' + that.uploadList.length + '/' + options.num + ') ');
                    }

                    if (options.num && that.uploadList.length >= options.num) {

                        // 超过最大文件数量
                        target.prev('div.sdui-uploader-container').find('.sdui-uploader-select').addClass('sdui-uploader-btn-disabled');
                    }

                    //如果裁剪
                    if (options.type.name == 'image' && options.cropper == true) {

                        $.sdCropper({
                            image: that._parseFilePath(file),
                            ok: function (dataURL, blob) {

                                console.log('裁剪完成==============>>>>>>');
                                //console.log(dataURL);
                                that.uploadList.remove(file);
                                that.uploadList.push(blob);
                                that._renderThumbnail(options, blob);

                            }
                        });

                    }
                    else {
                        that._renderThumbnail(options, file);
                    }


                }
            }

            target.val("");
        });


        var uploader_view_container = "<div class='sdui-uploader-container'><div class='sdui-uploader-action-bar'><a class='sdui-uploader-select sdui-uploader-btn'><span>选择文件</span><i></i></a><a class='sdui-uploader-upload sdui-uploader-btn'>开始上传</a><span class='sdui-uploader-tip'></span></div><div class='sdui-uploader-message'><i title='关闭'>x</i><cite></cite></div><ul></ul></div>";

        if (options.isAuto) {
            uploader_view_container = "<div class='sdui-uploader-container'><div class='sdui-uploader-action-bar'><a class='sdui-uploader-select sdui-uploader-btn'><span>选择文件</span><i></i></a><span class='sdui-uploader-tip'></span></div><div class='sdui-uploader-message'><i title='关闭'>x</i><cite></cite></div><ul></ul></div>";
        }

        target.hide();
        target.before(uploader_view_container);

        // 初始化文件列表
        if (sdutil.isArray(options.files)) {
            initNum = options.files.length;
            for (var i = 0; i < options.files.length; i++) {

                that._renderThumbnail(options, options.files[i]);
            }
        }

        if (options.num && options.num > 0) {
            target.prev('div.sdui-uploader-container').find('.sdui-uploader-select i').text(' (' + initNum + '/' + options.num + ') ');
        }
        if (options.barStyle == 'link') {
            // 如果是链接样式,则去除按钮风格, 默认按钮风格	
            target.prev('div.sdui-uploader-container').find('.sdui-uploader-btn').removeClass('sdui-uploader-btn');
        }

		if(options.tip) {
			target.prev('div.sdui-uploader-container').find('.sdui-uploader-tip').html(options.tip);
		}

        that._disabled(options);

        // 信息提示区域
        target.prev('div.sdui-uploader-container').find('.sdui-uploader-message').hide();

        target.prev('div.sdui-uploader-container').find('.sdui-uploader-message i').on('click', function () {
            target.prev('div.sdui-uploader-container').find('.sdui-uploader-message').hide();
        });

        target.prev('div.sdui-uploader-container').find('a.sdui-uploader-select span').html(options.text);
        target.prev('div.sdui-uploader-container').find('a.sdui-uploader-select').on('click', function () {
            if (!options.num || that.uploadList.length < options.num) {
                $(target).click();
            }
        });

        target.prev('div.sdui-uploader-container').find('a.sdui-uploader-upload').on('click', function () {

            for (var i = 0; i < that.uploadList.length; i++) {
                var pendingUploadFile = that.uploadList[i];

                if (!that._isSuccessUpload(pendingUploadFile)) {
                    that.upload(pendingUploadFile, options);
                }
            }
        });
    };

    Uploader.prototype._disabled = function (options) {

        // 检查uploader作用域，如果不存在则退出
        var target = $(options.target);
        if (!target[0]) return;

        if (options.isEditable == false) {
            // 隐藏上传插件顶部操作按钮
            target.prev('div.sdui-uploader-container').find('.sdui-uploader-action-bar').hide();
            // 隐藏 信息提示区域
            target.prev('div.sdui-uploader-container').find('.sdui-uploader-message').hide();

            //
            target.prev('div.sdui-uploader-container').find('.sdui-uploader-item-progress').hide();
            target.prev('div.sdui-uploader-container').find('.sdui-uploader-item-progress-error-hide').hide();
            target.prev('div.sdui-uploader-container').find('.sdui-uploader-delete').hide();
        }
    }

    Uploader.prototype.upload = function (file, options) {
        var that = this;

        options = options || {};
        options.fieldName = options.fieldName || 'files';

        var uploadData = new FormData();
        if (options.cropper == true) {
            console.log(file)
            uploadData.append(options.fieldName, file, Date.parse(new Date()) + '.png');
        } else {
            uploadData.append(options.fieldName, file);
        }
        var xhr;

        try {	//IE7+、Chrome、Firefox、Opera8.0+和Safari  
            xhr = new XMLHttpRequest();
        } catch (e) {
            try {//IE7+  
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {//IE5、6  
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                }
            }
        }

        // 监听当前进度
        xhr.upload.addEventListener("progress", function (e) {
            that._progress(options, file, e.loaded, e.total);
        }, false);

        // 监听上传完成
        xhr.addEventListener("load", function (e) {

            if (xhr.responseText) {
                // 回调到外部
                that._success(options, file, xhr.responseText);
            } else { // 如果返回的是空内容, 对应用来说就是上传失败
                that._failure(options, file, xhr.responseText);
            }
        }, false);

        // 监听错误事件
        xhr.addEventListener("error", function (e) {
            // 回调错误处理
            that._failure(options, file, xhr.responseText);
        }, false);

        xhr.open("POST", options.uploadUrl, true);
//		xhr.setRequestHeader("X_FILENAME", file.name);
        xhr.send(uploadData)

    };

    // 获取文件路径
    Uploader.prototype._parseFilePath = function (file) {
        var filePath = "";
        try {

            try {
                filePath = file.getAsDataURL();
            } catch (e) {
                filePath = window.URL.createObjectURL(file);
            }
        } catch (e) {
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    filePath = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }

        return filePath;
    };

    Uploader.prototype._renderThumbnail = function (options, selectedfile) {
        var that = this;
        that.uploadList = that.uploadList || [];

        var target = $(options.target);
        if (!target[0]) return;


        var reviewImage = function (img) {
            target.prev('div.sdui-uploader-container').find(img).sdViewer();
        };

        var filePath = '', fileName = '', fileExtName = '', fileSize = 0;
        if (typeof selectedfile !== 'string') {
            filePath = that._parseFilePath(selectedfile);
            fileName = selectedfile.name;
            fileExtName = that._transferFileExtension(selectedfile.type.toLowerCase());
            fileSize = selectedfile.size;
        } else {

            var jsonFile = eval('(' + selectedfile + ')');

            filePath = options.downUrl + jsonFile.fileId;
            fileName = jsonFile.fileName;
            fileExtName = jsonFile.fileExtName;
            fileSize = jsonFile.fileSize;
        }

        if (options.type.name == 'image') {

            var img = new Image();
            img.onload = function () {

                var whcss = "width:100px;";

                if (this.height > this.width) {
                    whcss = "height:100px;"
                }

                var thumbnailItem = $('<li class="sdui-uploader-item-thumbnail"><img src="' + img.src + '" style="' + whcss + '"/><div class="sdui-uploader-item-progress"><div class="sdui-uploader-item-progress-bar"></div></div><div class="sdui-uploader-item-error-hide"><span class="uploaderror">上传失败</span><span class="reupload">重新上传</span></div><div class="sdui-uploader-item-success-hide">上传成功</div><div class="sdui-uploader-item-title sdui-uploader-actionbar"><span class="sdui-uploader-download" title="若无法下载，请通过右击另存为下载~"><a href="' + img.src + '" target="_blank" download="">下载</a></span><span class="sdui-uploader-delete" title="删除">删除</span></div></li>');
                target.prev('div.sdui-uploader-container').find('ul').append(thumbnailItem);

                that._disabled(options);

                if (typeof selectedfile === 'string') {
                    var _f = {};
                    _f.fileId = filePath;
                    _f.fileName = fileName;
                    _f.fileExtName = fileExtName;
                    _f.fileSize = fileSize;

                    that.successList.push(_f);
                    that.flagList.push(true);
                    that.uploadList.push(_f);
                }

                if (typeof selectedfile !== 'string') {
                    thumbnailItem.find('.sdui-uploader-item-progress').addClass('sdui-uploader-item-progress-show');
                }

                /* thumbnailItem.on('click',function(e){
                 //		      		reviewImage($(this).find('img')[0]);
                 reviewImage('.sdui-uploader-item-thumbnail img');
                 });*/

                reviewImage('img');


                thumbnailItem.find('.sdui-uploader-actionbar').on('click', function (e) {
                    e.stopPropagation();
                });

                thumbnailItem.find('.sdui-uploader-delete').on('click', function (e) {
                    var dIndex = thumbnailItem.index();
                    target.prev('div.sdui-uploader-container').find('li').eq(dIndex).remove();
                    that.uploadList.del(dIndex);
                    that.successList.del(dIndex);
                    that.flagList.del(dIndex);

                    reviewImage('img');

                    if (options.num && options.num > 0) {
                        target.prev('div.sdui-uploader-container').find('.sdui-uploader-select i').text(' (' + that.uploadList.length + '/' + options.num + ') ');
                    }

                    if (!options.num || that.uploadList.length < options.num) {
                        // 超过最大文件数量
                        target.prev('div.sdui-uploader-container').find('.sdui-uploader-select').removeClass('sdui-uploader-btn-disabled');
                    }

                    // 触发完成通知
                    that._complete(options, that.successList);

                    e.stopPropagation();
                });

                thumbnailItem.find('.sdui-uploader-download').on('click', function (e) {
                    console.log('=====================================');
                });


                thumbnailItem.find('.sdui-uploader-item-error-hide').on('click', function (e) {

                    e.stopPropagation();
                });

                thumbnailItem.find('.reupload').on('click', function (e) {

                    //	        	options.uploadUrl='http://up.sdusz.com.cn/ptwjfw/rest/fileWS/upload';
                    that.upload(that.uploadList[thumbnailItem.index()], options);
                    $(thumbnailItem).find('.sdui-uploader-item-progress-bar').removeClass('sdui-uploader-item-progress-bar-failure');
                    $(thumbnailItem).find('.sdui-uploader-item-error-hide').removeClass('sdui-uploader-item-error-show');
                    e.stopPropagation();
                });

            };
            img.src = filePath;
        } else {
            var thumbnailItem = $('<li class="sdui-uploader-item-list"><div class="sdui-uploader-item-name" title="' + fileName + '"><span>' + fileName + '</span></div><div class="sdui-uploader-item-progress"><div class="sdui-uploader-item-progress-bar"></div></div><div class="sdui-uploader-item-progress-error-hide">&nbsp;<span class="reupload">上传</span></div><div class="sdui-uploader-item-title sdui-uploader-actionbar"><span class="sdui-uploader-download" title="若无法下载，请通过右击另存为下载~"><a href="' + filePath + '" target="_blank" download="'+fileName+'">下载</a></span><span class="sdui-uploader-delete" title="删除">删除</span></div></li>');
            target.prev('div.sdui-uploader-container').find('ul').append(thumbnailItem);

            if (typeof selectedfile === 'string') {
                var _f = {};
                _f.fileId = filePath;
                _f.fileName = fileName;
                _f.fileExtName = fileExtName;
                _f.fileSize = fileSize;

                that.successList.push(_f);
                that.flagList.push(true);
                that.uploadList.push(_f);

                // 对于网络上的资源,默认显示100%
                thumbnailItem.find('.sdui-uploader-item-progress-bar').css('width', '100%');
                thumbnailItem.find('.sdui-uploader-item-progress-error-hide .reupload').hide();

            }

            if (typeof selectedfile !== 'string') {
                thumbnailItem.find('.sdui-uploader-item-progress').addClass('sdui-uploader-item-progress-show');
            }

            /** thumbnailItem.on('click',function(e){
//		      		reviewImage($(this).find('img')[0])

		        });
             */


            var scrollWidth = thumbnailItem.find('.sdui-uploader-item-name span').eq(0).width() - thumbnailItem.find('.sdui-uploader-item-name').eq(0).width();
            var timeHover = null;
            var scrollFn = function (ele) {

                return function () {
                    // 先归位 TODO
                    ele.find('.sdui-uploader-item-name').eq(0).scrollLeft(0);

                    ele.find('.sdui-uploader-item-name').eq(0).animate({scrollLeft: scrollWidth}, 2000);
                }
            }

            thumbnailItem.hover(function (e) {
                timeHover = setTimeout(scrollFn($(this)), 500);

            }, function (e) {
                clearTimeout(timeHover);
                $(this).find('.sdui-uploader-item-name').eq(0).animate({scrollLeft: -scrollWidth}, 2000);
            });

            thumbnailItem.find('.sdui-uploader-actionbar').on('click', function (e) {
                e.stopPropagation();
            });

            thumbnailItem.find('.sdui-uploader-delete').on('click', function (e) {
                var dIndex = thumbnailItem.index();
                target.prev('div.sdui-uploader-container').find('li').eq(dIndex).remove();
                that.uploadList.del(dIndex);
                that.successList.del(dIndex);
                that.flagList.del(dIndex);

                if (options.num && options.num > 0) {
                    target.prev('div.sdui-uploader-container').find('.sdui-uploader-select i').text(' (' + that.uploadList.length + '/' + options.num + ') ');
                }

                if (!options.num || that.uploadList.length < options.num) {
                    // 超过最大文件数量
                    target.prev('div.sdui-uploader-container').find('.sdui-uploader-select').removeClass('sdui-uploader-btn-disabled');
                }

                // 触发完成通知
                that._complete(options, that.successList);

                e.stopPropagation();
            });

            thumbnailItem.find('.sdui-uploader-download').on('click', function (e) {
                console.log('=====================================');
            });


            thumbnailItem.find('.sdui-uploader-item-error-hide').on('click', function (e) {

                e.stopPropagation();
            });

            thumbnailItem.find('.reupload').on('click', function (e) {

                //	        	options.uploadUrl='http://up.sdusz.com.cn/ptwjfw/rest/fileWS/upload';
                that.upload(that.uploadList[thumbnailItem.index()], options);
                $(thumbnailItem).find('.sdui-uploader-item-progress-bar').removeClass('sdui-uploader-item-progress-bar-failure');
                $(thumbnailItem).find('.sdui-uploader-item-error-hide').removeClass('sdui-uploader-item-error-show');
                e.stopPropagation();
            });

        }

        if (typeof selectedfile !== 'string') {
            if (options.isAuto == true) {
                that.upload(selectedfile, options);
            }
        }
    }

    Uploader.prototype._transferFileExtension = function (mediatype) {
        var that = this;

        var extension = '';

        switch (mediatype) {
            case 'image/bmp':
                extension = 'BMP';
                break;
            case 'image/gif':
                extension = 'GIF';
            case 'image/jpeg':
                extension = 'JPEG';
                break;
            case 'image/jpg':
                extension = 'JPG';
                break;
            case 'image/png':
                extension = 'PNG';
                break;
            default:
                break;
        }

        return extension;
    }

    Uploader.prototype._isSupportImage = function (extension) {
        var that = this;

        var mediaType = '';

        if (extension) {
            switch (extension.toUpperCase()) {
                case 'BMP':
                    mediaType = 'image/bmp';
                    break;
                case 'GIF':
                    mediaType = 'image/gif';
                case 'JPEG':
                    mediaType = 'image/jpeg';
                    break;
                case 'JPG':
                    mediaType = 'image/jpg';
                    break;
                case 'PNG':
                    mediaType = 'image/png';
                    break;
                default:
                    break;
            }
        }

        return mediaType;
    }

    Uploader.prototype._isSupportFile = function (extension) {
        var that = this;

        var mediaType = '';

        if (extension) {
            /** switch (extension.toUpperCase()){
				case 'TXT':
					mediaType = 'text/plain';
					break;
				case 'WPS':
					mediaType = 'application/vnd.ms-works';
				case 'WDB':
					mediaType = 'application/vnd.ms-works';
					break;
				case 'XLS':
					mediaType = 'application/vnd.ms-excel';
					break;
				case 'ZIP':
					mediaType = 'aplication/zip';
					break;
				case 'BMP':
					mediaType = 'image/bmp';
					break;
				case 'GIF':
					mediaType = 'image/gif';
				case 'JPEG':
					mediaType = 'image/jpeg';
					break;
				case 'JPG':
					mediaType = 'image/jpg';
					break;
				case 'PNG':
					mediaType = 'image/png';
					break;
				case 'MP4':
					mediaType = 'audio/mp4,video/mp4';
					break;
				case 'MP3':
					mediaType = 'audio/mpeg';
					break;
				case 'DOC':
					mediaType = 'application/msword';
					break;
				case 'CSS':
					mediaType = 'text/css';
					break;
				case 'CSS':
					mediaType = 'text/css';
					break;
				default:
					break;
			}*/
        }

        return mediaType;
    }


    Uploader.prototype._isSuccessUpload = function (file) {
        var that = this;

        if (that.flagList[that._indexOf(file)]) {
            return true;
        }

        return false;
    }

    Uploader.prototype._indexOf = function (file) {
        var that = this;

        var index = -1;
        for (var i = 0; i < that.uploadList.length; i++) {
            if (that.uploadList[i] == file) {
                index = i;
                break;
            }
        }

        return index;
    }

    /* 上传进度系统内部回调 */
    Uploader.prototype._progress = function (options, file, loaded, total) {
        var that = this;

        var target = $(options.target);
        if (!target[0]) return;

        var thumbnails = target.prev('div.sdui-uploader-container').find('li');

        var index = that._indexOf(file);

        if (index >= 0 && thumbnails[index]) {
            $(thumbnails[index]).find('.sdui-uploader-item-progress-bar').css('width', loaded / total * 80 + '%');
            $(thumbnails[index]).find('.sdui-uploader-item-progress').addClass('sdui-uploader-item-progress-show');
            /*if(loaded/total == 1) {
             $(thumbnails[index]).find('.sdui-uploader-item-progress').addClass('sdui-uploader-item-progress-hide');
             }*/
        }
    };

    /* 上传成功系统内部回调 */
    Uploader.prototype._success = function (options, file, responseText) {
        var that = this;

        var target = $(options.target);
        if (!target[0]) return;

        var thumbnails = target.prev('div.sdui-uploader-container').find('li');

        var index = that._indexOf(file);
        if (index >= 0 && thumbnails[index]) {

            $(thumbnails[index]).find('.sdui-uploader-item-progress-bar').css('width', '100%');

            if (options.type.name == 'file') {
                // 对于网络上的资源,默认显示100%
                $(thumbnails[index]).find('.sdui-uploader-item-progress-error-hide .reupload').hide();
            }

            $(thumbnails[index]).find('.sdui-uploader-item-success-hide').addClass('sdui-uploader-item-success-show');

            setTimeout(function () {
                $(thumbnails[index]).find('.sdui-uploader-item-success-hide').removeClass('sdui-uploader-item-success-show');
            }, 2000);

            /*if(loaded/total == 1) {
             $(thumbnails[index]).find('.sdui-uploader-item-progress').addClass('sdui-uploader-item-progress-hide');
             }*/
        }

        // 从文件中删除上传成功的文件  
        //sdutil.removeItem(that.uploadList,file);
        // 不移除，将成功的结果缓存至成功列表

        /**
         *  此方法供客户端回调
         * @param {Object} imgPath
         */
        var pathCallback = function (imgPath) {

            var index = that._indexOf(file);

            if (index >= 0) {
                that.successList[index] = imgPath;
                that.flagList[index] = true;
            }

            that._complete(options, that.successList);
        }

        options.uploadedCB(pathCallback, responseText);

    };

    /* 上传失败系统内部回调 */
    Uploader.prototype._failure = function (options, file, responseText) {
        var that = this;

        var target = $(options.target);
        if (!target[0]) return;

        var thumbnails = target.prev('div.sdui-uploader-container').find('li');

        var index = that._indexOf(file);

        if (index >= 0 && thumbnails[index]) {

            var pwidth = $(thumbnails[index]).find('.sdui-uploader-item-progress-bar').css('width');

            if (pwidth.startsWith('0')) {
                $(thumbnails[index]).find('.sdui-uploader-item-progress-bar').css('width', '60%'); // 如果进度条为0,则设置一个默认值,用于友好显示
            }

            $(thumbnails[index]).find('.sdui-uploader-item-progress-bar').addClass('sdui-uploader-item-progress-bar-failure');
            $(thumbnails[index]).find('.sdui-uploader-item-error-hide').addClass('sdui-uploader-item-error-show');
        }
    };

    /* 上传完成系统内部回调 */
    Uploader.prototype._complete = function (options, files) {

        var that = this, finishFiles = [];

        if (that.successList) {
            for (var i = 0; i < that.successList.length; i++) {
                if (that.successList[i]) {
                	var o = that.successList[i];
                	that.successList[i].fileId = o.fileId.replace(options.downUrl,'');
                    finishFiles.push(that.successList[i]);
                }
            }
        }

        options.completeCB(finishFiles, finishFiles.length == that.uploadList.length);
    };


    $.fn.sdUploader = function (options) {
        var _this = this;

        if (!this[0]) return;

        var defaultOptions = {
            uploadUrl: '',
            downUrl: '',
            text: '请选择文件',
            tip:'<font style="color:red;">最多可上传5张图片，每个图片大小不超过5M，支持bmp,gif,jpeg,jpg, png格式文件</font>',
            type: {
                name: 'image'  // 定义上传类型,  image: 表示只上传图片,  file: 上传各种类型文件
                , ext: ''
            },
            barStyle: 'button',  // 工具条样式, button: 按钮样式 , link : 链接样式
            isAuto: true, // 是否自动上传
            isEditable: true, // 默认可执行上传,删除等操作,否则只作为渲染插件
            cropper: false, //是否裁剪图片
            async: true,	// 是否异步
            num: null,	// 最多上传数量
            size: null,// // 文件最大大小
            files: null,// 初始文件数组 , 提供基本文件路径即可，比如 ['group3/M00/00/33/rBEKEFmw4amADzKcAAHA0OptiFg771.jpg','group3/M00/00/33/rBEKEFmw4a-AKnL7AAMF606P0VU545.jpg','group3/M00/00/33/rBEKEFmw4bWAdnpKAATY_SsHKxw676.jpg','group3/M00/00/33/rBEKEFmw45eAJFxiAARPnV0X5RM476.gif']
            uploadedCB: function (pathCallback, response) {
                // 数据加载成功后，希望执行的操作

                // {"errorCode":null,"errorMsg":null,"msgObj":[{"fileSize":154510,"fileId":"group3/M00/00/32/rBEKEFmwsbmAfs03AAJbjgLrq30930.jpg","fileName":"591441b8N8b274b75.jpg","fileExtName":"JPG"}],"res":"abc","successFlg":true}

                /*var response = eval('(' + response + ')');

                 if(response && response.successFlg==true) {
                 pathCallback(response.msgObj[0]);
                 }*/

            }
            , completeCB: function (successFiles, isEnd) {
                // 返回所有成功文件
            }
        }

        options = $.extend(true, {}, defaultOptions, options);

        options = options || {}, options.target = this[0];

        // 新建上传器，用于执行上传
        var sdUploader = new Uploader();
        sdUploader.init(options);
    }

})(jQuery, window, document);


/**
 * sdViewer 预览器
 *
 * @author wangbinbin
 * @date 2017-09-11
 */
;
(function ($, window, document, undefined) {

    var Viewer = function (options) {
        var that = this;

        that.options = options;
        that._shade = null;		// 对应当前显示器的背景层
        that._closeBtn = null;	// 关闭按钮
        that._review = null;	// 当前查看器显示区域
        that._thumbnail = null;	// 当前查看器缩略图工具
        that._viewcontainer = null; // 当前查看器容器
    };

    Viewer.prototype.init = function (selectors) {
        var that = this;

        that._bindEvent(selectors);
    };

    Viewer.prototype._zindex = function (newzindex) {

        if (!newzindex) {
            // 为以后弹出层组件预留
            var indexhiddenValue = 2017090610;
            if ($('#indexhidden')[0]) {
                indexhiddenValue = $('#indexhidden')[0].value * 1 + 1;
                $('#indexhidden')[0].value = indexhiddenValue;
            } else {
                $('body').append('<input id="indexhidden" type="hidden" value="' + indexhiddenValue + '"/>');
            }

            return indexhiddenValue;
        } else {
            $('#indexhidden')[0].value = newzindex;
        }
    };

    Viewer.prototype._vshade = function () {
        var that = this;

        var zindex = that._zindex();
        that._zindex(zindex++);
        $(".sdui-viewer-shade").remove();
        var shadeDIV = $('<div class="sdui-viewer-shade" style="z-index:' + zindex + ';width:100%;height:100%;position:absolute;opacity: 0.5;background:#7C7C7C;top:0;left:0;"></div>');
        that._shade = shadeDIV;
        $('body').append(shadeDIV);
    };

    Viewer.prototype._vthumbnails = function (selectors, showidx) {
        var that = this;

        var zindex = that._zindex();
        that._zindex(zindex++);
        // 创建viewer容器
        var reviewContainer = $('<div class="sdui-viewer-container" style="z-index:' + zindex + ';"></div>')
        $('body').append(reviewContainer);
        that._viewcontainer = reviewContainer; // 当前查看器容器

        // 创建缩略图区域
        var thumbnailsDIV = $('<div class="sdui-viewer-thumbnails"><i class="left">  </i><i class="right">  </i><div class="center"><ul></ul></div></div><div class="sdui-viewer-counter"><i class="seq">1</i>/<i class="total">1</i></div>');

        for (var i = 0; i < selectors.length; i++) {

            var whcss = "width:60px;", activeClass = "";

            showidx = showidx || 0;

            if (i == showidx) {
                activeClass = "active";
            }

            if ($(selectors[i]).height() > $(selectors[i]).width()) {
                whcss = "height:80px;"
            }

            var li = $('<li class="' + activeClass + '"><img src="' + selectors[i].src + '" style="' + whcss + '"></li>');
            thumbnailsDIV.find('ul').append(li);
        }

        // 创建底部缩略图条
        reviewContainer.append(thumbnailsDIV);

        // 创建缩略图区域
        var closeButton = $('<div class="sdui-viewer-close"><i></i></div>');
        that._closeBtn = closeButton;
        reviewContainer.append(closeButton);


        that._thumbnail = thumbnailsDIV;	// 当前查看器缩略图工具

        that._vshowscroll();

        // 默认渲染第一个图片
        that._vshowDetail(thumbnailsDIV.find('li:eq(' + showidx + ')').find('img')[0]);
    };

    Viewer.prototype._vshowscroll = function () {
        var that = this;

        that._thumbnail.find('div.center').scrollLeft(2);

        if (that._thumbnail.find('div.center').scrollLeft() > 0) {

            that._thumbnail.find('i.left').show();
            that._thumbnail.find('i.right').show();
        } else {
            that._thumbnail.find('i.left').hide();
            that._thumbnail.find('i.right').hide();
        }

        that._thumbnail.find('div.center').scrollLeft(0);
    }

    Viewer.prototype._vcounter = function (index, total) {
        var that = this;
        index = index || 1, total = total || 1;
        that._thumbnail.find('i.seq').text(index);
        that._thumbnail.find('i.total').text(total);
    }

    Viewer.prototype._vshowDetail = function (image) {
        var that = this;

        $(".sdui-viewer-review").remove();
        var reviewDIV = $('<div class="sdui-viewer-review"><div><img src="' + image.src + '"></div></div>');
        $('.sdui-viewer-thumbnails').before(reviewDIV);
        that._review = reviewDIV;	// 当前查看器显示区域

        that._review.find('img').on('click', function (e) {

            e.stopPropagation();
        });

        reviewDIV.fadeIn("slow");
    }


    Viewer.prototype._vresetThumbnailPosition = function () {
        var that = this;

        var index = that._thumbnail.find('li').index(that._thumbnail.find('li.active'));
        var scrollLeft = that._thumbnail.find('div.center').scrollLeft();

        that._thumbnail.find('div.center').animate({scrollLeft: 62 * index}, 1000);

        that._vcounter(index + 1, that._thumbnail.find('li').length);
    }

    Viewer.prototype._bindEvent = function (selectors) {
        var that = this;

        $(selectors).off('click');
        $(selectors).on('click', function (e) {
            that._vshade();
            that._vthumbnails(selectors, $(selectors).index($(this)));

            that._vresetThumbnailPosition();

            that._viewcontainer.on('click', function () {

                if (that.options.shadeClose == true) {
                    if (that._shade) {
                        that._shade.remove();
                    }

                    if (that._viewcontainer) {
                        that._viewcontainer.remove();
                    }
                }
            });

            that._review.on('click', function () {

                if (that.options.shadeClose == true) {
                    if (that._shade) {
                        that._shade.remove();
                    }

                    if (that._viewcontainer) {
                        that._viewcontainer.remove();
                    }
                }
            });

            that._closeBtn.on('click', function () {
                if (that._shade) {
                    that._shade.remove();
                }

                if (that._viewcontainer) {
                    that._viewcontainer.remove();
                }
            });

            that._thumbnail.on('click', function (e) {

                e.stopPropagation();
            });

            that._thumbnail.find('li').on('click', function (e) {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');

                that._vshowDetail($(this).find('img')[0]);

                that._vresetThumbnailPosition();

                e.stopPropagation();
            });

            that._thumbnail.find('i.left').on('click', function (e) {
                var scrollLeft = that._thumbnail.find('div.center').scrollLeft();
                that._thumbnail.find('div.center').animate({scrollLeft: scrollLeft - 62 * 2}, 500);
            });

            that._thumbnail.find('i.right').on('click', function (e) {
                var scrollLeft = that._thumbnail.find('div.center').scrollLeft();
                that._thumbnail.find('div.center').animate({scrollLeft: scrollLeft + 62 * 2}, 500);
            });

            // 监听缩略图区域resize事件 
            that._thumbnail.find('div.center').resize(function () {
                that._vshowscroll();
            });

        });
    };

    $.fn.sdViewer = function (options) {
        var _this = this;

        if (!_this[0]) return;

        var defaultOptions = {
            shadeClose: false // 点击遮罩层,是否关闭
        }

        options = $.extend(true, {}, defaultOptions, options);

        var viewer = new Viewer(options);

        viewer.init(_this);
    }

})(jQuery, window, document);


/**
 * sdCalendar 日历器
 *
 * @author wangbinbin
 * @date 2017-09-15
 */
;
(function ($, window, document, undefined) {

    var Calendar = function (options) {
        var that = this;

        that.options = options;
        that.c_data = {
            week: ['一', '二', '三', '四', '五', '六', '日'],
            month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十一月', '十二月']
        };

        that._container = null;
        that._header = null;
        that._title = null;
        that._body = null;
        that._footer = null;
        that._start_date = null;
    };

    Calendar.prototype.run = function () {
        var that = this;

        that._draw();
    }

    Calendar.prototype._draw = function () {
        var that = this;


        var target = $(that.options.target);
        if (!target[0]) return;


        var c_container = $('<div class="sdui-calendar"></div>');
        var c_header = $('<div class="cal-header"><i class="cal-prev"></i><i class="cal-next"></i><div class="cal-header-date"><span class="year"></span> - <span class="month"></span></div><span class="today">今天</span></div>');
        var c_title = $('<ul class="cal-title"></ul>');
        var c_body = $('<ul class="cal-body"></ul>');


        that._container = c_container;
        that._header = c_header;
        that._title = c_title;
        that._body = c_body;

        target.append(c_container);

        c_container.append(c_header);
        c_container.append(c_title);
        c_container.append(c_body);

        that._refreshWeek();


        var _tmp_header_date = new Date().format('yyyy-MM');

        //判断是否是当前月
        if (that.options.activeDate) {
            _tmp_header_date = new Date(that.options.activeDate).format('yyyy-MM');
        }


        var _tmp_year = _tmp_header_date.split('-')[0];
        var _tmp_month = _tmp_header_date.split('-')[1]


        that._switchMonth(_tmp_year, _tmp_month);

    }

    Calendar.prototype._refreshWeek = function () {
        var that = this;
        var weeks = that.c_data.week, months = that.c_data.month;
        for (var i = 0; i < weeks.length; i++) {
            that._title.append('<li>' + weeks[i] + '</li>');
        }


    }

    //判断是否为当前月，进行切换
    Calendar.prototype._switchMonth = function (year, month) {

        var that = this;

        var currentMonth = new Date(year, month - 1, 1).format("yyyy-MM");

        if (currentMonth != that._currentMonth) {
            that._currentMonth = currentMonth;
            that._header.find('.cal-header-date').text(currentMonth);
            that._refreshDate(year, month);
        }

    }

    Calendar.prototype._refreshDate = function (year, month) {
        var that = this;

        that._body.empty();

        var _date = new Date(year, month - 1, 1);

        var week = _date.getDay() == 0 ? 7 : _date.getDay();

        var _c_start_day = new Date(Date.parse(_date) - (week - 1) * 24 * 3600 * 1000);
        that._start_date = _c_start_day;

        for (var i = 0; i < 35; i++) {

            var _c_every_date = new Date(Date.parse(_c_start_day) + i * 24 * 3600 * 1000);
            var _c_every_date_str = _c_every_date.format('yyyy-MM-dd');
            var _today = new Date().format('yyyy-MM-dd');


            var istoday = '';
            if (_c_every_date_str == _today) istoday = 'today';

            var isCrtMonth = '';
            if (_c_every_date.getMonth() == (month - 1)) isCrtMonth = 'c_month';

            var _date = $('<li class="' + isCrtMonth + ' ' + istoday + '" data="' + _c_every_date_str + '"><div>' + _c_every_date.getDate() + '<cite></cite></div></li>');
            that._body.append(_date);
        }

        that._bindEvent();

    }

    Calendar.prototype._bindEvent = function () {
        var that = this;

        var marker = function (datas, footer) {
            // datas是一个数组, 元素格式: {date:'yyyy-MM-dd',markers:['red','pink','black']}
            if (sdutil.isArray(datas)) {
                for (var i = 0; i < datas.length; i++) {
                    for (var j = 0; j < datas[i].markers.length; j++) {
                        that._body.find('li[data="' + datas[i].date + '"]').find('cite').append('<i style="color:' + datas[i].markers[j] + '"></i>');
                    }
                }
            }

            if (footer) {

                if (that._footer) {
                    that._footer.empty();
                    that._footer.append(footer);
                } else {
                    var c_footer = $('<div class="cal-footer"></div>');
                    that._footer = c_footer;
                    that._container.append(c_footer);

                    c_footer.append(footer);
                }
            }
        }
        //初始化选中
        if (that.options.activeDate) {
            that._body.find("li[data=" + that.options.activeDate + "]").addClass('active');
        }

        // renderCB
        var _start_date_str = that._start_date.format('yyyy-MM-dd');
        var _end_date_str = new Date(Date.parse(that._start_date) + 34 * 24 * 3600 * 1000).format('yyyy-MM-dd');
        sdutil.isFunction(that.options.renderCB) && that.options.renderCB.call('', _start_date_str, _end_date_str, marker);


        // clickCB
        that._body.find('li').off('click');
        that._body.find('li').on('click', function () {
            var clickDate = $(this).attr("data");

            that.options.activeDate = clickDate;

            var _tmp_year = clickDate.split('-')[0];
            var _tmp_month = clickDate.split('-')[1]

            that._switchMonth(_tmp_year, _tmp_month);

            $(this).siblings().removeClass('active');
            $(this).addClass('active');

            sdutil.isFunction(that.options.clickCB) && that.options.clickCB.call('', $(this).attr('data'));
        });

        // 下个月
        that._header.find('i.cal-next').off('click');
        that._header.find('i.cal-next').on('click', function (e) {

            var _showed_month = that._currentMonth.split("-");

            var _tmp_date = new Date(_showed_month[0] * 1, _showed_month[1] * 1 - 1);

            _tmp_date.setMonth(_tmp_date.getMonth() + 1);

            that._switchMonth(_tmp_date.getFullYear(), _tmp_date.getMonth() + 1);

        });

        // 上个月
        that._header.find('i.cal-prev').off('click');
        that._header.find('i.cal-prev').on('click', function (e) {

            var _showed_month = that._currentMonth.split("-");

            var _tmp_date = new Date(_showed_month[0] * 1, _showed_month[1] * 1 - 1);

            _tmp_date.setMonth(_tmp_date.getMonth() - 1);

            that._switchMonth(_tmp_date.getFullYear(), _tmp_date.getMonth() + 1);
        });

        // 跳转至今天
        that._header.find('.today').off('click');
        that._header.find('.today').on('click', function (e) {
            var _tmp_header_date = new Date().format('yyyy-MM');
            var _tmp_year = _tmp_header_date.split('-')[0];
            var _tmp_month = _tmp_header_date.split('-')[1]

            that._switchMonth(_tmp_year, _tmp_month);
        });
    }

    $.fn.sdCalendar = function (options) {

        var defaultOptions = {
            activeDate: "",//传递当前选中的日子
            clickCB: function (date) {
//				console.log('>>>>>>>>>>>>>> 当前选中的日期:'+date);
            }
            , renderCB: function (start_date, end_date, markerFn) {
                /*console.log('===== start_date:'+start_date+',end_date:'+end_date);

                 //
                 var datas = [{date:'2017-09-22',markers:['red']},{date:'2017-09-29',markers:['#D36469','#000000']}]
                 markerFn(datas,'<div>黄色表示危险, 红色表示警告</div>');*/
            }
        };

        options = $.extend(true, {}, defaultOptions, options);

        options = options || {}, options.target = this[0];

        var calendar = new Calendar(options);

        calendar.run();
    };

})(jQuery, window, document);


/**
 * 图片裁剪插件
 * @author wangbinbin
 * @date 2017-09-21
 */
;
(function ($, window, document, undefined) {

    var cropbox = function (options) {
        var el = document.querySelector(options.imageBox),
            obj =
            {
                state: {},
                ratio: 1,
                options: options,
                imageBox: el,
                thumbBox: el.querySelector(options.thumbBox),
                spinner: el.querySelector(options.spinner),
                image: new Image(),
                getDataURL: function () {
                    var width = this.thumbBox.clientWidth,
                        height = this.thumbBox.clientHeight,
                        canvas = document.createElement("canvas"),
                        dim = el.style.backgroundPosition.split(' '),
                        size = el.style.backgroundSize.split(' '),
                        dx = parseInt(dim[0]) - el.clientWidth / 2 + width / 2,
                        dy = parseInt(dim[1]) - el.clientHeight / 2 + height / 2,
                        dw = parseInt(size[0]),
                        dh = parseInt(size[1]),
                        sh = parseInt(this.image.height),
                        sw = parseInt(this.image.width);

                    canvas.width = width;
                    canvas.height = height;
                    var context = canvas.getContext("2d");
                    context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
                    var imageData = canvas.toDataURL('image/png');
                    return imageData;
                },
                getBlob: function () {
                    var imageData = this.getDataURL();
                    var b64 = imageData.replace('data:image/png;base64,', '');
                    var binary = atob(b64);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return new Blob([new Uint8Array(array)], {type: 'image/png'});
                },
                zoomIn: function () {
                    this.ratio *= 1.1;
                    setBackground();
                },
                zoomOut: function () {
                    this.ratio *= 0.9;
                    setBackground();
                }
            },
            attachEvent = function (node, event, cb) {
                if (node.attachEvent)
                    node.attachEvent('on' + event, cb);
                else if (node.addEventListener)
                    node.addEventListener(event, cb);
            },
            detachEvent = function (node, event, cb) {
                if (node.detachEvent) {
                    node.detachEvent('on' + event, cb);
                }
                else if (node.removeEventListener) {
                    node.removeEventListener(event, render);
                }
            },
            stopEvent = function (e) {
                if (window.event) e.cancelBubble = true;
                else e.stopImmediatePropagation();
            },
            setBackground = function () {
                var w = parseInt(obj.image.width) * obj.ratio;
                var h = parseInt(obj.image.height) * obj.ratio;

                var pw = (el.clientWidth - w) / 2;
                var ph = (el.clientHeight - h) / 2;

                el.setAttribute('style',
                    'background-image: url(' + obj.image.src + '); ' +
                    'background-size: ' + w + 'px ' + h + 'px; ' +
                    'background-position: ' + pw + 'px ' + ph + 'px; ' +
                    'background-repeat: no-repeat');
            },
            imgMouseDown = function (e) {
                stopEvent(e);

                obj.state.dragable = true;
                obj.state.mouseX = e.clientX;
                obj.state.mouseY = e.clientY;
            },
            imgMouseMove = function (e) {
                stopEvent(e);

                if (obj.state.dragable) {
                    var x = e.clientX - obj.state.mouseX;
                    var y = e.clientY - obj.state.mouseY;

                    var bg = el.style.backgroundPosition.split(' ');

                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);

                    el.style.backgroundPosition = bgX + 'px ' + bgY + 'px';

                    obj.state.mouseX = e.clientX;
                    obj.state.mouseY = e.clientY;
                }
            },
            imgMouseUp = function (e) {
                stopEvent(e);
                obj.state.dragable = false;
            },
            zoomImage = function (e) {
                var evt = window.event || e;
                var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta;
                delta > -120 ? obj.ratio *= 1.1 : obj.ratio *= 0.9;
                setBackground();
            }

        obj.spinner.style.display = 'block';
        obj.image.onload = function () {
            obj.spinner.style.display = 'none';
            setBackground();

            attachEvent(el, 'mousedown', imgMouseDown);
            attachEvent(el, 'mousemove', imgMouseMove);
            attachEvent(document.body, 'mouseup', imgMouseUp);
            var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? 'DOMMouseScroll' : 'mousewheel';
            attachEvent(el, mousewheel, zoomImage);
        };
        obj.image.src = options.imgSrc;
        attachEvent(el, 'DOMNodeRemoved', function () {
            detachEvent(document.body, 'DOMNodeRemoved', imgMouseUp)
        });

        return obj;
    };

    var SdCropper = function (options) {
        var that = this;

        that.options = options;
        that._shade = null;
        that._cropper = null; // 裁剪工具类对象
        that._cropperContainer = null;  // 裁剪容器
        that._cropperArea = null;  // 裁剪渲染区域
        that._actionBar = null;  // 工具条
        that._closeBtn = null;  // 关闭按钮
    };

    SdCropper.prototype._draw = function () {
        var that = this;

        that._vshade();
        that._vcanvas();
        that._loadImage();
    }

    SdCropper.prototype._zindex = function (newzindex) {

        if (!newzindex) {
            // 为以后弹出层组件预留
            var indexhiddenValue = 2017090610;
            if ($('#indexhidden')[0]) {
                indexhiddenValue = $('#indexhidden')[0].value * 1 + 1;
                $('#indexhidden')[0].value = indexhiddenValue;
            } else {
                $('body').append('<input id="indexhidden" type="hidden" value="' + indexhiddenValue + '"/>');
            }

            return indexhiddenValue;
        } else {
            $('#indexhidden')[0].value = newzindex;
        }
    };

    SdCropper.prototype._vshade = function () {
        var that = this;

        var zindex = that._zindex();
        that._zindex(zindex++);
        $(".sdui-viewer-shade").remove();
        var shadeDIV = $('<div class="sdui-viewer-shade" style="z-index:' + zindex + ';width:100%;height:100%;position:absolute;opacity: 0.5;background:#7C7C7C;top:0;left:0;"></div>');
        that._shade = shadeDIV;
        $('body').append(shadeDIV);
    };

    SdCropper.prototype._vcanvas = function () {
        var that = this;

        // 创建viewer容器
        var zindex = that._zindex();
        that._zindex(zindex++);
        var cropperContainer = $('<div class="sdui-cropper-container" style="z-index:' + zindex + ';"></div>')
        $('body').append(cropperContainer);
        that._cropperContainer = cropperContainer; // 当前查看器容器


        var cropperArea = $('<div class="sdui-cropper-box-outer"><div class="sdui-cropper-box"><div class="sdui-cropper-thumb-box"></div><div class="sdui-cropper-spinner" style="display: none">Loading...</div></div></div>');
        that._cropperArea = cropperArea;
        that._cropperContainer.append(cropperArea);

        var actionBar = $('<div class="sdui-cropper-action-bar"><span class="zoom-in">放大</span><span class="zoom-out">缩小</span><span class="ok">确定</span></div>')
        cropperArea.find('.sdui-cropper-box').append(actionBar);
        that._actionBar = actionBar;

        // 创建缩略图区域
        var closeButton = $('<div class="sdui-cropper-close"><i></i></div>');
        that._closeBtn = closeButton;
        that._cropperContainer.append(closeButton);

        that._bindEvent();
    }

    SdCropper.prototype._loadImage = function () {
        var that = this;

        var options =
        {
            imageBox: '.sdui-cropper-box',
            thumbBox: '.sdui-cropper-thumb-box',
            spinner: '.sdui-cropper-spinner',
            imgSrc: that.options.image
        }
        that._cropper = new cropbox(options);

    }


    SdCropper.prototype._close = function () {
        var that = this;

        if (that._shade) {
            that._shade.remove();
        }

        if (that._cropperContainer) {
            that._cropperContainer.remove();
        }

    }

    SdCropper.prototype._bindEvent = function () {
        var that = this;

        that._actionBar.find('.zoom-in').off('click');
        that._actionBar.find('.zoom-in').on('click', function () {
            that._cropper.zoomIn();
        });


        that._actionBar.find('.zoom-out').off('click');
        that._actionBar.find('.zoom-out').on('click', function () {
            that._cropper.zoomOut();
        });

        that._actionBar.find('.ok').off('click');
        that._actionBar.find('.ok').on('click', function () {

            if (sdutil.isFunction(that.options.ok)) {
                that.options.ok.call('', that._cropper.getDataURL(), that._cropper.getBlob());
                that._close();
            }
        });

        that._closeBtn.on('click', function () {
            that._close();
        });
    }

    $.extend({
        sdCropper: function (options) {

            var defaultOptions = {
                image: ''
                , ok: function (dataURL, blob) {
                    console.log(dataURL);

                }
            };

            options = $.extend(true, {}, defaultOptions, options);

            options = options || {}, options.target = this[0];

            var cropper = new SdCropper(options);
            cropper._draw();
        }
    });


})(jQuery, window, document);

/**
 * sdSidebar 页面工具条
 * @author wangzheng
 * @date 2017-09-21
 */
;
(function ($, window, document, undefined) {

    var Sidebar = function (options) {
        var that = this;

        that.options = options;

        that._container = null;
        that._back_top = null;

    };

    Sidebar.prototype.init = function () {
        var that = this;

        that._draw();
    };

    Sidebar.prototype._draw = function () {
        var that = this;

        var s_container = $('<ul class="sdui-sidebar"></ul>');

        s_container.css({
            'bottom': that.options.position.bottom,
            'left': that.options.position.left,
            'right': that.options.position.right,
            'top': that.options.position.top
        })

        s_container.appendTo("body");

        that._container = s_container;


        //画返回顶部按钮
        that._drawBack();

        //绑定事件
        that._bindEvent();


    };

    Sidebar.prototype._drawBack = function () {
        var that = this;

        var s_back_top = $('<li class="gotop" title="' + that.options.backTop.text + '" ><a href="javascript:void(0)">' + that.options.backTop.content + '</a></li>');


        that._back_top = s_back_top;

        that._container.append(that._back_top);


    };

    Sidebar.prototype._bindEvent = function () {
        var that = this;

        //返回顶部事件绑定

        that._back_top.click(function () {
            $("html, body").animate({scrollTop: 0}, parseInt(that.options.backTop.duration, 10));
        });

        //判断是否显示按钮
        var showOrHide = function () {
            var scrollTop = $(window).scrollTop();
            (scrollTop > 0) ? that._back_top.show() : that._back_top.hide();
        }

        $(window).bind("scroll", showOrHide);

        //初始时判断
        showOrHide();

        console.log(that._back_top)

    };

    $.sdSideBar = function (options) {
        var defaultOptions = {
            backTop: {
                text: "回到顶部",
                duration: 300,
                content: ""
            },
            position: {
                left: null,
                top: null,
                right: '20px',
                bottom: '20px'
            }
        };

        options = $.extend(true, {}, defaultOptions, options);

        options = options || {}, options.target = this[0];

        var sidebar = new Sidebar(options);

        sidebar.init();
    };
})(jQuery, window, document);
