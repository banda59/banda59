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

  // 인사말과 GIF 섹션
  const headerSection = `# Hi, I'm banda 👋\n---\n![chipi](https://github.com/banda59/README/blob/main/gif/chipi-chipi-chapa-chapa.gif)\n`;

  // "Hi, I'm banda 👋" 섹션 중복 방지
  if (!readmeContent.startsWith(headerSection)) {
    readmeContent = headerSection + readmeContent;
  }

  // 최신 5개의 글의 제목과 링크를 추가할 텍스트 생성
  let latestPosts = "### Latest Blog Posts 😽🔐\n---\n";
  for (let i = 0; i < 5 && i < feed.items.length; i++) {
    const { title, link } = feed.items[i];
    latestPosts += `- [${title}](${link})\n`;
  }

  // "Latest Blog Posts" 섹션 중복 방지
  const regex = /### Latest Blog Posts [\s\S]*?(?=\n### |\n$|$)/;
  if (regex.test(readmeContent)) {
    // 기존 섹션 대체
    readmeContent = readmeContent.replace(regex, latestPosts);
  } else {
    // 새 섹션 추가
    readmeContent += `\n\n${latestPosts}`;
  }

  // 변경된 내용 저장
  writeFileSync(readmePath, readmeContent, "utf8");

  console.log("README.md 업데이트 완료");
})();
