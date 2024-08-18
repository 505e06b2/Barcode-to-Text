class Log {
	#container_element;

	#createElement(text) {
		const element = document.createElement("DIV");
		element.innerText = text;
		return element;
	}

	get attached() {
		return (this.#container_element !== undefined);
	}

	attachToContainer(element) {
		this.#container_element = element;
		this.clear();
	}

	append(text) {
		if(this.attached === false) return;

		this.#container_element.append(this.#createElement(text));
	}

	appendWarning(text) {
		if(this.attached === false) return;

		const element = this.#createElement(text);
		element.classList.add("warning");
		element.innerText = `⚠️ ${element.innerText}`;
		this.#container_element.append(element);
	}

	appendError(text) {
		if(this.attached === false) return;

		const element = this.#createElement(text);
		element.classList.add("error");
		element.innerText = `🛑 ${element.innerText}`;
		this.#container_element.append(element);
	}

	clear() {
		this.#container_element.innerHTML = "";
	}
}

export default new Log();
