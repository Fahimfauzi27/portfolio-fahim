document.addEventListener("DOMContentLoaded", function() {
    // 1. Replace this URL with your generated RSS-to-JSON feed URL
    // (e.g., using FetchRSS or a public RSS-Bridge instance for your LinkedIn username)
    const RSS_JSON_API = "https://api.rss2json.com/v1/api.json?rss_url=https://fetchrss.com/rss/your_generated_id";

    const feedContainer = document.getElementById("linkedinFeed");
    const syncTimeElement = document.getElementById("feedLastSynced");

    // Set today's date as the sync time
    if(syncTimeElement) {
        syncTimeElement.innerText = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Fetch the data
    fetch(RSS_JSON_API)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                feedContainer.innerHTML = ''; // Clear any loading placeholders

                data.items.forEach(item => {
                    // Clean up the text (remove HTML tags from RSS description)
                    let cleanText = item.description.replace(/<[^>]*>/g, '').substring(0, 180) + "...";
                    let postDate = new Date(item.pubDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                    
                    // Generate premium matching cards dynamically
                    const cardHTML = `
                        <article class="glass-card rounded-2xl border border-white/5 hover:border-blue-500/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col overflow-hidden group">
                            <div class="p-6 flex-grow">
                                <div class="flex items-center space-x-2 text-xs text-slate-400 font-medium mb-3">
                                    <span>\${postDate}</span>
                                    <span>•</span>
                                    <span class="text-blue-400"><i class="fab fa-linkedin-in text-[10px]"></i> LinkedIn Post</span>
                                </div>
                                <h3 class="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition duration-150">
                                    \${item.title || "Latest Update"}
                                </h3>
                                <p class="text-slate-400 text-sm leading-relaxed">
                                    \${cleanText}
                                </p>
                            </div>
                            <div class="px-6 pb-6 pt-0">
                                <a href="\${item.link}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center space-x-1 group/btn">
                                    <span>Read Full Post</span>
                                    <i class="fa-solid fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition duration-150 ml-1"></i>
                                </a>
                            </div>
                        </article>
                    `;
                    feedContainer.innerHTML += cardHTML;
                });
            } else {
                showFallbackUI();
            }
        })
        .catch(err => {
            console.error("Error fetching LinkedIn feed:", err);
            showFallbackUI();
        });

    function showFallbackUI() {
        feedContainer.innerHTML = `<p class="text-slate-500 text-sm text-center col-span-full py-8">Temporary trouble loading live updates. Click 'View Native Profile' above to read my recent posts.</p>`;
    }
});