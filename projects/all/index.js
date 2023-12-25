loadJson("games.json", "game", false);
loadJson("researches.json", "research", false);
loadJson("talks.json", "talk", true);
loadJson("tools.json", "tool", false);
loadJson("jams.json", "jam", false);
loadJson("other.json", "other", false);

function loadJson(url, section, isTalk) {
	const template = isTalk ? document.getElementById("talk-template") : document.getElementById("project-template");
	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			data.forEach((dataItem) => {
				const clone = document.importNode(template.content, true);
				var htmlContent = clone
					.querySelector("a")
					.innerHTML.replace(/%(\w*)%/g, function (m, key) {
						return dataItem.hasOwnProperty(key)
							? dataItem[key]
							: "";
					});
				clone.querySelector("a").innerHTML = htmlContent;
				clone.querySelector("a").href = dataItem.url;
				document.getElementById(section).appendChild(clone);
			});
		})
		.catch((error) => {
			console.error("Error fetching JSON data:", error);
		});
}