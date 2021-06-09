export async function renderTwitterPage() {
    const $root = $('#root');
    $root.empty();
    getRecentTweets();
    $(".newtweet").on("click", tweetLayout);
    $root.on("click", ".like", likeTweet);
    $root.on("click", ".deleted", deleteTweet);
    $root.on("click", ".posting", submitTweet);
    $root.on("click", ".unlike", dislikeTweet);
    $root.on("click", ".reply", replyLayout);
    $root.on("click", ".replyPost", submitReply);
    $root.on("click", ".edit", editLayout);
    $root.on("click", ".editPost", submitEdit);
    $root.on("click", ".retweet", retweetLayout);
    $root.on("click", ".retweetPost", submitRetweet);
}

export async function getRecentTweets() {
    const $root = $('#root');
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
    });
    for (let i = 0; i < 50; i++) {
        let tweet  = result.data[i];
        $root.append(
            `<div class="card" id="tweet${tweet.id}">
            <header class="card-header">
              <p class="card-header-title">
                ${tweet.author}
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                ${tweet.body}
                <br>
                <time class="is-size-7 has-text-weight-light" datetime="${tweet.createdAt}">${(new Date(tweet.createdAt)).toLocaleTimeString()}</time>
              </div>
            </div>`
        );

        if (tweet.isMine) {
            $root.append(`<footer class="card-footer" id="footer${tweet.id}">
                <button specificTweet="${tweet.id}" class="myLikes card-footer-item button">
                ${tweet.likeCount} Likes </button>
                
                <button specificTweet="${tweet.id}" author="${tweet.author}" tweetbody="${tweet.body}" class="retweet card-footer-item button">
                ${tweet.retweetCount} Retweets </button>
                <button specificTweet="${tweet.id}" author="${tweet.author}" tweetbody="${tweet.body}" class="reply card-footer-item button">
                ${tweet.replyCount} Replies </button>
                <button specificTweet="${tweet.id}" author="${tweet.author}" tweetbody="${tweet.body}" class="edit card-footer-item button">
                Edit Tweet</button>
                <button specificTweet="${tweet.id}" class="deleted card-footer-item button">
                Delete Tweet</button>
                </footer>
                </div>
                <br>`
            );

        }
        if (!tweet.isMine) {
            if (!tweet.isLiked) {
                $root.append(`<footer class="card-footer" id="footer${tweet.id}">
                    <button type="button" tweetbody="${tweet.body}" rpc="${tweet.replyCount}" rtc="${tweet.retweetCount}" author="${tweet.author}" specificTweet="${tweet.id}" current="${tweet.likeCount}" class="like card-footer-item button" type="submit">
                    ${tweet.likeCount} Likes  </button>
                    <button specificTweet="${tweet.id}" author="${tweet.author}" tweetbody="${tweet.body}" class="retweet card-footer-item button">
                    ${tweet.retweetCount} Retweets </button>
                    <button specificTweet="${tweet.id}" tweetbody="${tweet.body}" author="${tweet.author}" class="reply card-footer-item button">
                    ${tweet.replyCount} Replies </button>
                    </footer>
                    </div>
                    <br>`
                );
            } else {
                $root.append(`<footer class="card-footer" id="footer${tweet.id}">
                    <button specificTweet="${tweet.id}" current="${tweet.likeCount}" class="unlike card-footer-item button" type="submit">
                    ${tweet.likeCount} Likes (You Liked!) </button>
                    <button specificTweet="${tweet.id}" author="${tweet.author}" tweetbody="${tweet.body}" class="retweet card-footer-item button">
                    ${tweet.retweetCount} Retweets </button>
                    <button specificTweet="${tweet.id}" tweetbody="${tweet.body}" author="${tweet.author}" class="reply card-footer-item button">
                    ${tweet.replyCount} Replies </button>
                    </footer>
                    </div>
                    <br>`
                );
            }
        }   
    }

}



export function tweetLayout(event) {
    let actualTweet = event.target.getAttribute('specificTweet');
    $('#root').prepend(`<div class="tweetdraft">
        <div class="subtitle has-text-grey-darker is-bold"> Compose Tweet </div>
            <form>
                <textarea class="textarea" placeholder="What's on your mind?" id="newdraft"></textarea>
                <button class="cancel button"> Cancel </button>
                <button class="posting button" type="submit"> Post Your Tweet! </button>
            </form>
        </div>
        <br>`
    );
}

export async function submitTweet(event) {
    event.preventDefault();
    let text = $('#newdraft').val();
    const result = await axios ({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        data: {
            body: text,
        },
        withCredentials: true,

    });
    const $root = $('#root');
    $root.empty();
    getRecentTweets();
}

export async function deleteTweet(event) {
    let actualTweet = event.target.getAttribute('specificTweet');
    const result = await axios ({
        method: 'delete',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + actualTweet,
        withCredentials: true,
    });
    $('#tweet' + actualTweet).remove();
    $('#footer' + actualTweet).remove();
}

export async function likeTweet(event) {
    let actualTweet = event.target.getAttribute('specificTweet');
    let currentNum = event.target.getAttribute('current');
    let body = event.target.getAttribute('tweetbody');
    let author = event.target.getAttribute('author');
    let rtc = event.target.getAttribute('rtc');
    let rpc = event.target.getAttribute('rpc');

    const result = await axios({
        method: 'put',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + actualTweet + '/like',
        withCredentials: true,
    });
    $('#footer' + actualTweet).replaceWith(`<footer class="card-footer" id="footer${actualTweet}">
    <button specificTweet="${actualTweet}" current="${currentNum++}" class="unlike card-footer-item button" type="submit">
    ${currentNum++} Likes (You Liked!) </button>
    <button specificTweet="${actualTweet}" author="${author}" tweetbody="${body}" class="retweet card-footer-item button">
    ${rtc} Retweets </button>
    <button specificTweet="${actualTweet}" tweetbody="${body}" author="${author}" class="reply card-footer-item button">
    ${rpc} Replies </button>
    </footer>
    </div>
    <br>`)
}

export async function dislikeTweet(event) {
    let actualTweet = event.target.getAttribute('specificTweet');
    const result = await axios ({
        method: 'put',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + actualTweet + '/unlike',
        withCredentials: true,
    });
    const $root = $('#root');
    $root.empty();
    getRecentTweets();
}

export function replyLayout(event) {
    event.preventDefault();
    let actualTweet = event.target.getAttribute('specificTweet');
    $('#footer' + actualTweet).remove();
    $('#tweet' + actualTweet).replaceWith(`<div class="replylayout">
        <div class="subtitle has-text-grey-darker is-bold"> Reply to ${event.target.getAttribute('author')}:'s Tweet: "${event.target.getAttribute('tweetbody')}":  </div>
            <form>
                <textarea class="textarea" placeholder="Enter Reply" id="newreply"></textarea>
                <button class="cancel button"> Cancel </button>
                <button class="replyPost button" specificTweet="${event.target.getAttribute('specificTweet')}" type="submit"> Post Your Reply! </button>
            </form>
        </div>
        <br>`
    );
}

export async function submitReply(event) {
    event.preventDefault();
    let replyContent = $('#newreply').val();
    let actualTweet = event.target.getAttribute('specificTweet');
    const result = await axios ({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            type: "reply",
            parent: actualTweet,
            body: replyContent,
        },

    });
    const $root = $('#root');
    $root.empty();
    getRecentTweets();
}

export function editLayout(event) {
    event.preventDefault();
    let actualTweet = event.target.getAttribute('specificTweet');
    $('#footer' + actualTweet).remove();
    $('#tweet' + actualTweet).replaceWith(`<div class="editlayout">
        <div class="subtitle has-text-grey-darker is-bold"> Edit Your Post: </div>
            <form>
                <textarea class="textarea" placeholder="${event.target.getAttribute('tweetbody')}" id="newedit"></textarea>
                <button class="cancel button"> Cancel </button>
                <button class="editPost button" specificTweet="${event.target.getAttribute('specificTweet')}" type="submit"> Post Edited Tweet! </button>
            </form>
        </div>
        <br>`
    );
}

export async function submitEdit(event) {
    event.preventDefault();
    let editContent = $('#newedit').val();
    const result = await axios ({
        method: 'put',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + event.target.getAttribute('specificTweet'),
        withCredentials: true,
        data: {
            body: editContent,
        },
    });
    const $root = $('#root');
    $root.empty();
    getRecentTweets();
}


export function retweetLayout(event) {
    event.preventDefault();
    let actualTweet = event.target.getAttribute('specificTweet');
    $('#footer' + actualTweet).remove();
    $('#tweet' + actualTweet).replaceWith(`<div class="retweetlayout">
        <div class="subtitle has-text-grey-darker is-bold"> Quote Your Retweet of "${event.target.getAttribute('tweetbody')}" from ${event.target.getAttribute('author')}: </div>
            <form>
                <textarea class="textarea" placeholder="Commentary" id="newretweet"></textarea>
                <button class="cancel button"> Cancel </button>
                <button class="retweetPost button" tweetbody="${event.target.getAttribute('tweetbody')}" author="${event.target.getAttribute('author')}" specificTweet="${event.target.getAttribute('specificTweet')}" type="submit"> Post Retweet! </button>
            </form>
        </div>
        <br>`
    );
}

export async function submitRetweet(event) {
    event.preventDefault();
    let retweetContent = $('#newretweet').val();
    let author = event.target.getAttribute('author');
    const result = await axios ({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            type: "retweet",
            parent: event.target.getAttribute('specificTweet'),
            body: `RT @${author}'s Tweet: "${event.target.getAttribute('tweetbody')}": ` + retweetContent,
        },
    });
    const $root = $('#root');
    $root.empty();
    getRecentTweets();
}

$(function () {
    renderTwitterPage();
});







