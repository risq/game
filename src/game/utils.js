function oneInNFrame(n, counter, callback) {
	if (counter.count === (n - 1)) {
		callback();
		counter.count = 0;
	}
	else {
		counter.count++;
	}
}