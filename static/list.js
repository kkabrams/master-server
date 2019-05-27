var master;
if (!master) master = {};
if (typeof(master.root) == 'undefined')	master.root = window.location.href;
if (!master.output)	master.output = '#server_list';
if (!master.list)	master.list = "list";
if (!master.list_root)	master.list_root = master.root;
if (!master.list_url)	master.list_url = master.list_root + master.list;

// Utility functions used by the templating code

function humanTime(seconds) {
	if (typeof(seconds) != "number") return '?';
	var conv = {
		y: 31536000,
		d: 86400,
		h: 3600,
		m: 60
	};
	for (var i in conv) {
		if (seconds >= conv[i]) {
			return (seconds / conv[i]).toFixed(i=='y'?1:0) + i;
		}
	}
	return seconds + 's';
}

function escapeHTML(str) {
	if(!str) return str;
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function addressString(server) {
	var isIPv6 = server.address.indexOf(":") != -1;
	var addrStr = (isIPv6 ? '[' : '') +
		escapeHTML(server.address) +
		(isIPv6 ? ']' : '');
	var shortStr = addrStr;
	addrStr += ':' + server.port;
	var str = '<span'
	if (shortStr.length > 25) {
		shortStr = shortStr.substr(0, 23) + "&hellip;";
		str += ' title="' + addrStr + '"'
	}
	var verStr = escapeHTML(server.version);
	if (server.port != 30000)
		shortStr += ':' + server.port;
	return str + '><a href="minetest://' + shortStr + '/">' + shortStr + '</a></span>';
}

function tooltipString(str, maxLen) {
	str = escapeHTML(str);
	var ret = str;
	if (ret.length > maxLen) {
		ret = '<div class="mts_tooltip" style="width:' + maxLen + 'ch;"';
		ret += ' title="' + str + '">' + str + '</div>';
	}
	return ret;
}

function hoverList(name, list) {
	if (!list || list.length == 0) return '';
	var str = '<div class="mts_hover_list">'
	str += '<b>' + name + '</b> (' + list.length + ')<br />';
	for (var i in list) {
		str += escapeHTML(list[i]) + '<br />';
	}
	return str + '</div>';
}

function hoverString(name, string) {
	if (!string) return '';
	return '<div class="mts_hover_list">'
		+ '<b>' + name + '</b>:<br />'
		+ escapeHTML(string) + '<br />'
		+ '</div>';
}

function constantWidth(str, width) {
	return '<span class="mts_cwidth" style="width:' + width + 'em;">' + str + '</span>';
}

// Code that fetches & displays the actual list

function draw(json) {
	var html = window.render.servers(json);
	jQuery(master.output).html(html);
}

function get() {
	jQuery.getJSON(master.list_url, draw);
}

function loaded(){
	if (!master.no_refresh) {
		setInterval(get, 60 * 1000);
	}
	get();
}


// https://github.com/pyrsmk/toast
this.toast=function(){var e=document,t=e.getElementsByTagName("head")[0],n=this.setTimeout,r="createElement",i="appendChild",s="addEventListener",o="onreadystatechange",u="styleSheet",a=10,f=0,l=function(){--f},c,h=function(e,r,i,s){if(!t)n(function(){h(e)},a);else if(e.length){c=-1;while(i=e[++c]){if((s=typeof i)=="function"){r=function(){return i(),!0};break}if(s=="string")p(i);else if(i.pop){p(i[0]),r=i[1];break}}d(r,Array.prototype.slice.call(e,c+1))}},p=function(n,s){++f,/\.css$/.test(n)?(s=e[r]("link"),s.rel=u,s.href=n,t[i](s),v(s)):(s=e[r]("script"),s.src=n,t[i](s),s[o]===null?s[o]=m:s.onload=l)},d=function(e,t){if(!f)if(!e||e()){h(t);return}n(function(){d(e,t)},a)},v=function(e){if(e.sheet||e[u]){l();return}n(function(){v(e)},a)},m=function(){/ded|co/.test(this.readyState)&&l()};h(arguments)};

toast(master.root + 'style.css', master.root + 'servers.js', function() {
	if (typeof(jQuery) != 'undefined')
		return loaded();
	else
		toast('//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js', loaded);
});

