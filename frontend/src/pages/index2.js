<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YouTube Search</title>
    <script>
        function searchYouTube() {
            const query = document.getElementById("query").value;

            fetch("/youtube/search?q=" + encodeURIComponent(query), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                let resultDiv = document.getElementById("result");
                resultDiv.innerHTML = ""; // 기존 검색 결과 초기화

                if (data.error) {
                    resultDiv.innerHTML = "<p style='color: red;'>" + data.error + "</p>";
                } else {
                    data.items.forEach(item => {
                        let videoLink = `<p><a href="https://www.youtube.com/watch?v=${item.videoId}" target="_blank">${item.title}</a></p>`;
                        resultDiv.innerHTML += videoLink;
                    });
                }
            })
            .catch(error => console.error("Error:", error));
        }
    </script>
</head>
<body>
    <h1>유튜브 검색</h1>
    <input type="text" id="query" placeholder="검색어 입력">
    <button onclick="searchYouTube()">검색</button>

    <div>
        <h2>검색결과</h2>
        <div id="result"></div>
    </div>
</body>
</html>
