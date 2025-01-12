import { readFileSync, writeFileSync } from "node:fs";
import Parser from "rss-parser";

// 기존 README.md 파일 읽기
const readmePath = "README.md";
let readmeContent = readFileSync(readmePath, "utf8");

// RSS 파서 생성
const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
  },
});

// 최신 블로그 포스트와 섹션 추가하는 함수
(async () => {
  // RSS 피드 가져오기
  const feed = await parser.parseURL("https://spacefriend.tistory.com/rss");

  // 인사말과 GIF 추가
  const headerSection = `# Hi, I'm banda 👋\n\n![chipi](https://github.com/banda59/README/blob/main/gif/chipi-chipi-chapa-chapa.gif)\n\n`;

  // 최신 5개의 글의 제목과 링크를 추가할 텍스트 생성
  let latestPosts = "## Latest Blog Posts 😽🔐\n\n";
  for (let i = 0; i < 5 && i < feed.items.length; i++) {
    const { title, link } = feed.items[i];
    latestPosts += `- [${title}](${link})\n`;
  }

  // 전체 내용 생성
  const fullContent = `${headerSection}${latestPosts}`;

  // 기존 README를 완전히 대체
  writeFileSync(readmePath, fullContent, "utf8");

  console.log("README.md 업데이트 완료");
})();
