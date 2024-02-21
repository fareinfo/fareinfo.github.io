/**!
 * @license Markdown-Tag - Add Markdown to any HTML using a <md> tag or md attribute
 * LICENSED UNDER GPL-3.0 LICENSE
 * MARKDOWN FLAVOUR: GITHUB FLAVORED MARKDOWN. 
 * MORE INFO / FLAVOR OPTIONS CAN BE FOUND AT https://github.com/MarketingPipeline/Markdown-Tag/
 */



// To Enable Debug Messages - set this to true
var DebugMarkdownTag = false;

/* Console Log Debbuger */
function DEBUG(msg) {
	if (DebugMarkdownTag === true) {
		console.log(msg)
	}
}



function markdownToHTML(tags, flavor, isAttribute) {


	/* Fetch MD files from URL or Path */
	async function getData(src) {
		try {
			DEBUG("Fetching File From URL or Path")
			const res = await fetch(src);
			const jsonResult = await res.text();
			if (jsonResult === "Not Found") {
				DEBUG("Error rendering content -  file path was not found")
				throw 'Error rendering markdown contents - file Path Not Found';
			} else {
				DEBUG("File was loaded successfully")
				return jsonResult
			}


		} catch (error) {
			return error;
		}
	}






	/* Add Github CSS  */

	var Tag_CSSAdded = false;
	var Attribute_CSSAdded = false;

	function addCSSforTag(fileName) {
		if (Tag_CSSAdded == false) {
			DEBUG("Added CSS for Tag(s)")
			var head = document.head;
			var link = document.createElement("link");

			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = fileName;

			head.appendChild(link);
			Tag_CSSAdded = true

		}



	}

	function addCSSforAttributes(fileName) {
		if (Attribute_CSSAdded == false) {
			DEBUG("Added CSS for Attribute(s)")
			var head = document.head;
			var link = document.createElement("link");

			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = fileName;

			head.appendChild(link);
			Attribute_CSSAdded = true

		}
	}


	/* CSS for Syntax Highlighting via Prism.js */

	var SyntaxCSSAdded = false;

	function addSyntaxHighlightCss(fileName) {

		if (SyntaxCSSAdded == false) {
			var head = document.head;
			var link = document.createElement("link");

			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = fileName;

			head.appendChild(link);
			SyntaxCSSAdded = true

		}

	}


	var SyntaxHighlighterJSAdded = false;

	function addSyntaxHighlighter() {


		if (SyntaxHighlighterJSAdded === false) {
			/// Add Prism.JS to document
			var script = document.createElement('script');
			script.src = "https://cdn.jsdelivr.net/npm/prismjs@1.28.0/prism.min.js";

			document.head.appendChild(script);




			// On Error Loading Markdown Parser
			script.onerror = function() {

				console.error("Markdown Tag: Error while performing function addSyntaxHighlighter - There was an error loading the Syntax Highlighter");

			}


			/// Markdown Parser Load Successful 
			script.onload = function() {


				DEBUG("Syntax Highlighter Was Loaded")

				SyntaxHighlighterJSAdded = true;

			}
		};
	}

	DEBUG("Converting Markdown To HTML")



	if (flavor === "GFM") {

		// if attribute type - it requires a class added. 
		var converter = new showdown.Converter()

		if (isAttribute == true) {
			tags.forEach(tag => {
				tag.classList.add("github-md");
			})

			// Stylesheet for attributes
			addCSSforAttributes('https://cdn.jsdelivr.net/gh/MarketingPipeline/Markdown-Elements/stylesheets/github_md_attr.min.css');

		} else {

			// Stylesheet for tags
			addCSSforTag('https://cdn.jsdelivr.net/gh/MarketingPipeline/Markdown-Elements/stylesheets/github_md.css');

		}

		// Syntax Highlighting Sheet for GitHub like Colors
		addSyntaxHighlightCss('https://cdn.jsdelivr.net/gh/PrismJS/prism-themes/themes/prism-ghcolors.css');

		// Load Syntax Highlighter by default for github-md tags or attributes   

		addSyntaxHighlighter()



		converter.setOption('omitExtraWLInCodeBlocks', 'on')

		// converter.setOption('ghCompatibleHeaderId ', 'on')

		converter.setOption('literalMidWordUnderscores', 'on')



		converter.setOption('tables', 'on')
		converter.setOption('tablesHeaderId', 'true')

		converter.setOption('emoji', 'on')

		converter.setOption('strikethrough', 'on')

		converter.setOption('tasklists', 'true')


		converter.setOption('ghMentions', 'true')


		converter.setOption('simplifiedAutoLink', 'true');
	} else {

		// OPTIONS REQUIRED FOR GFM

		var converter = new showdown.Converter()
		converter.setOption('omitExtraWLInCodeBlocks', 'on')

		converter.setOption('literalMidWordUnderscores', 'on')



		converter.setOption('tables', 'on')
		converter.setOption('tablesHeaderId', 'true')

		converter.setOption('emoji', 'on')

		converter.setOption('strikethrough', 'on')

		converter.setOption('tasklists', 'true')


		converter.setOption('ghMentions', 'true')


		converter.setOption('simplifiedAutoLink', 'true');

	}

	tags.forEach(tag => {
		if (tag.hasAttribute("highlight")) {
			addSyntaxHighlighter()
		}
		if (tag.getAttribute("src")) {
			// load file / url content
			getData(tag.getAttribute("src")).then(data => {
				if (data instanceof Error) {
					// error fetching file
					DEBUG("Error rendering file to markdown")
					tag.innerHTML = converter.makeHtml("Error rendering file to markdown")
					tag.setAttribute("md-rendered-error", '')
				} else {
					DEBUG("Rendered file from path or URL to markdown")
					// there was NOT an error fetching file / URL content
					tag.innerHTML = converter.makeHtml(data)
					tag.setAttribute("md-rendered", '')
				}
			})

		}
		// Tag does NOT have src attribute
		else {
			DEBUG("Rendered tag or attribute to markdown")
			// render markdown content in md tag or attribute
			tag.setAttribute("md-rendered", '')
			tag.innerHTML = converter.makeHtml(tag.innerHTML.replace(/&gt;/g, '>'))

		}

	});
}





function renderMarkdown() {


	/* Convert Markdown Attributes */



	if (document.querySelectorAll('[md]').length > 0) {

		DEBUG("MD attribute(s) were found, coverting content to Markdown")
		MD_TAGs = document.querySelectorAll('[md]');


		markdownToHTML(MD_TAGs, MarkdownFlavor = null, isAttribute = true)




	}




	if (document.querySelectorAll('[github-md]').length > 0) {

		DEBUG("github-md attribute(s) were found, coverting content to Markdown")

		GitHub_MD_TAGs = document.querySelectorAll('[github-md]');


		markdownToHTML(GitHub_MD_TAGs, MarkdownFlavor = "GFM", isAttribute = true)

	}


	/* Convert Markdown Tags */

	if (document.getElementsByTagName("md").length > 0) {
		DEBUG("md tag(s) were found, coverting content to Markdown")

		MDTAGs = document.querySelectorAll('md');


		markdownToHTML(MDTAGs, MarkdownFlavor = null, isAttribute = false)




	}



	if (document.getElementsByTagName("github-md").length > 0) {
		DEBUG("github-md tag(s) were found, coverting content to Markdown")

		GitHub_MD_TAGs = document.querySelectorAll("github-md");



		markdownToHTML(GitHub_MD_TAGs, MarkdownFlavor = "GFM", isAttribute = false)
	}
}






function loadMarkdownParser() {
	DEBUG("Adding Markdown Parser (ShowDown.js) To HTML document")
	/// Add Markdown Parser To Document
	var script = document.createElement('script');
	script.src = "https://cdn.jsdelivr.net/gh/MarketingPipeline/Markdown-Elements/parsers/showdown.min.js";

	document.head.appendChild(script);   




	// On Error Loading Markdown Parser
	script.onerror = function() {

		console.error("Markdown Tag: Error while performing function LoadMarkdownParser - There was an error loading the Markdown Parser")

	}


	/// Markdown Parser Load Successful 
	script.onload = function() {

		// Let the Magic Begin 
		DEBUG("Markdown Parser Load Successful")
		renderMarkdown()

	};
}
loadMarkdownParser()
