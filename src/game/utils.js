function oneInNFrame(n, counter, callback) {
	if (counter.count === (n - 1)) {
		callback();
		counter.count = 0;
	}
	else {
		counter.count++;
	}
}

function randIntInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}