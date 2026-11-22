/* RSI Watch — static archive, jQuery 3.7.1 */
(function($){"use strict";
if(!$){document.getElementById("news").textContent="jQuery 加载失败，请检查网络。";return;}
var items=[],readIds={},status={};
try{readIds=JSON.parse(localStorage.getItem("rsi-watch-read-v1")||"{}")||{};}catch(e){readIds={};}
var labels={reflection:"普通自我反思",harness:"Agent / Harness 优化",research:"AI 辅助 AI 研发",crossgen:"跨代自我修改",strong:"强 RSI 闭环"};
function esc(v){return $("<div>").text(String(v==null?"":v)).html();}
function validUrl(u){try{var x=new URL(u);return x.protocol==="https:"||x.protocol==="http:";}catch(e){return false;}}
function save(){try{localStorage.setItem("rsi-watch-read-v1",JSON.stringify(readIds));}catch(e){}}
function render(){var q=$("#search").val().toLowerCase().trim(),cat=$("#category").val(),unread=$("#unread-only").prop("checked");
var filtered=items.filter(function(x){return (!cat||x.category===cat)&&(!unread||!readIds[x.id])&&(!q||[x.title,x.summary,x.organization,(x.tags||[]).join(" ")].join(" ").toLowerCase().includes(q));});
$("#news").empty();$("#empty").prop("hidden",filtered.length!==0);
filtered.forEach(function(x){var el=$("<article>").addClass("article").toggleClass("unread",!readIds[x.id]);
var meta=$("<div>").addClass("meta").append($("<time>").text(x.published_at||"日期待核实"),$("<span>").addClass("tag").text(labels[x.category]||"研究"),$("<span>").text(x.organization||""));
if(!readIds[x.id])meta.append($("<span>").text("● 未读"));
var title=$("<h3>").addClass("article-title").attr({role:"button",tabindex:"0","aria-expanded":"false"}).text(x.title);el.append(meta,title,$("<p>").text(x.summary));
var detail=$("<div>").addClass("details");if(x.assessment)detail.append($("<p>").text("证据判断："+x.assessment));if(x.verified_at)detail.append($("<p>").text("最近核实："+x.verified_at));
var links=$("<div>").addClass("sources");(x.sources||[]).forEach(function(s){if(validUrl(s.url))links.append($("<a>").attr({href:s.url,target:"_blank",rel:"noopener noreferrer"}).text(s.label||"原始来源"));});
var full=$("<div>").addClass("full-article").hide();(x.content||[]).forEach(function(section){full.append($("<h4>").text(section.heading),$("<p>").text(section.body));});var expand=$("<button>").addClass("read expand").text("阅读完整新闻").attr("aria-expanded","false").on("click",function(){var visible=full.is(":visible");full.toggle(!visible);$(this).text(visible?"阅读完整新闻":"收起新闻内容").attr("aria-expanded",String(!visible));if(!visible&&!readIds[x.id]){readIds[x.id]=true;save();$("#unread-count").text(items.filter(function(y){return !readIds[y.id];}).length+" 条未读");el.removeClass("unread");button.text("标为未读");}title.attr("aria-expanded",String(!visible));}});title.on("click",function(){expand.trigger("click");}).on("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();expand.trigger("click");}});detail.append(expand,full);var button=$("<button>").addClass("read").text(readIds[x.id]?"标为未读":"标为已读").on("click",function(){if(readIds[x.id])delete readIds[x.id];else readIds[x.id]=true;save();render();});
links.append(button);detail.append(links);el.append(detail);$("#news").append(el);});
$("#unread-count").text(items.filter(function(x){return !readIds[x.id];}).length+" 条未读");
}
$.when($.getJSON("data/index.json?v=20261122b"),$.getJSON("data/status.json?v=20261122b")).done(function(a,b){items=(a[0].articles||[]).filter(function(x){return x&&typeof x.id==="string"&&typeof x.title==="string";}).sort(function(x,y){return String(y.published_at).localeCompare(String(x.published_at));});status=b[0]||{};$("#stage").text(status.stage||"—");$("#stage-note").text(status.stage_note||"");$("#strong-count").text(items.filter(function(x){return x.category==="strong"&&x.confirmed===true;}).length);$("#total-count").text(items.length);$("#checked-at").text(status.checked_at||"—");render();}).fail(function(){$("#news").html('<p class="error">新闻数据加载失败。请通过 GitHub Pages 或本地 HTTP 服务器打开本站。</p>');});
$("#search,#category,#unread-only").on("input change",render);
})(window.jQuery);