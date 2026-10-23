// 스크롤이 되면 헤더 모양이 바뀜
const gnb = document.querySelector(".gnb");

window.addEventListener("scroll", function () {
  gnb.classList.toggle("on", window.scrollY > 100);
});

/* =========================================================
  DISCOGRAPHY
   ========================================================= */
(() => {
  /* ===== 앨범 정보: 여기서 수정 =====
    img   : 커버 이미지 경로
    title : 앨범 제목
    type  : 태그 (예: "1ST ALBUM", "SINGLE")
    date  : 발매일
    label : LP 가운데 라벨 색
    link  : 듣기 버튼 링크 (아직 없으면 "#" 그대로 두기)
    tracks: 수록곡 배열 (비워두면 [] → TRACKS 버튼이 사라짐) */
  const albums = [
    { img: "img/cover01.webp",  title: "WISH", type: "The 1st Single", date: "2024.02.28", label: "#8AC629", link: "https://nct-wish.lnk.to/WISH", tracks: ["WISH (title)", "Sail Away"] },
    { img: "img/cover02.webp", title: "Songbird", type: "The 2nd Single", date: "2024.07.01", label: "#91C0D6", link: "https://NCT-WISH.lnk.to/Songbird_", tracks: ["Songbird (title)", "Tears Are Falling"] },
    { img: "img/cover09.webp",  title: "Steady", type: "The 1ST Mini Album", date: "2024.09.24", label: "#98001B", link: "https://nctwish.lnk.to/steady", tracks: ["Steady (title)", "3 Minutes", "Dunk Shot"] },
    { img: "img/cover03.jpg",  title: "poppop", type: "The 2nd Mini Album", date: "2025.04.14", label: "#5FA7E0", link: "https://nctwish.lnk.to/poppop", tracks: ["poppop (title)", "Melt Inside My Pocket", "Design", "1000", "Silly Dance", "Still 3PM"] },
    { img: "img/cover12.webp", title: "COLOR", type: "The 3rd Mini Album", date: "2025.09.01", label: "#F3B23C", link: "https://NCT-WISH.lnk.to/COLOR", tracks: ["COLOR (title)", "Baby Blue", "Surf", "Cheat Code", "Videohood", "WICHU", "Reel-ationship"] },
    { img: "img/cover04.webp", title: "Ode to Love", type: "SINThe 1st AlbumGLE", date: "2026.04.20", label: "#E6E4E1", link: "https://nctwish.lnk.to/OdetoLove", tracks: ["2.0", "Ode to Love (title)", "Sticky", "Feel The Beat", "Crush", "Street", "Glow Up", "Everglow", "Don't Say You Love Me", "Voyage"] },
    { img: "img/cover07.jpg",  title: "I SPY", type: "The 4th Mini Album", date: "2026.10.12", label: "#e535ab", link: "https://nctwish.lnk.to/ISPY", tracks: ["I SPY (title)", "We Own This Street", "UPGRADE", "Super Major", "Hubble Time", "Like A Dream"] },
  ];

  /* ===== 요소 ===== */
  const root = document.querySelector(".discography");
  if (!root) return;
  const $ = (sel) => root.querySelector(sel);

  const panel = $(".dg_panel");
  const cover = $(".dg_cover");
  const tag = $(".dg_tag");
  const title = $(".dg_title");
  const date = $(".dg_date");
  const listen = $(".dg_listen");
  const tracksBtn = $(".dg_tracks_btn");
  const tracklist = $(".dg_tracklist");
  const bars = $(".dg_bars");
  const now = $(".dg_now");
  const total = $(".dg_total");

  const len = albums.length;
  const FADE = 220; // CSS의 transition 시간(0.22s)과 맞춤
  let idx = 0;
  let busy = false;

  total.textContent = len;

  /* 이미지 미리 불러오기 (넘길 때 깜빡임 방지) */
  albums.forEach((a) => {
    const im = new Image();
    im.src = a.img;
  });

  /* 페이지 막대 만들기 */
  albums.forEach((a, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dg_bar";
    b.setAttribute("aria-label", `${i + 1}번째 앨범: ${a.title}`);
    b.addEventListener("click", () => go(i));
    bars.appendChild(b);
  });

  /* ===== 화면에 앨범 표시 ===== */
  function render() {
    const a = albums[idx];
    cover.src = a.img;
    cover.alt = a.title;
    tag.textContent = a.type;
    title.textContent = a.title;
    date.textContent = a.date;
    now.textContent = idx + 1;
    panel.style.setProperty("--label", a.label);

    /* LISTEN: 링크가 있으면 새 탭, 없으면(#) 그냥 둠 */
    const hasLink = a.link && a.link !== "#";
    listen.href = hasLink ? a.link : "#";
    if (hasLink) listen.target = "_blank";
    else listen.removeAttribute("target");

    /* TRACKS: 앨범이 바뀌면 목록은 접고 내용만 교체 */
    tracklist.hidden = true;
    tracksBtn.setAttribute("aria-expanded", "false");
    tracklist.innerHTML = "";
    (a.tracks || []).forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      tracklist.appendChild(li);
    });
    tracksBtn.hidden = !(a.tracks && a.tracks.length);

    [...bars.children].forEach((b, i) => {
      b.classList.toggle("on", i === idx);
      b.setAttribute("aria-current", i === idx ? "true" : "false");
    });
  }

  /* ===== 앨범 바꾸기 (페이드 아웃 → 교체 → 페이드 인) ===== */
  function go(n) {
    if (busy || n === idx) return;
    busy = true;
    panel.classList.add("is_out");
    setTimeout(() => {
      idx = n;
      render();
      panel.classList.remove("is_out");
      setTimeout(() => {
        busy = false;
      }, FADE);
    }, FADE);
  }
  function step(dir) {
    go((idx + dir + len) % len); // 처음과 끝은 이어짐
  }

  /* ===== 화살표 ===== */
  $(".dg_prev").addEventListener("click", () => step(-1));
  $(".dg_next").addEventListener("click", () => step(1));

  /* ===== 스와이프 (터치 + 마우스 드래그) ===== */
  let sx = 0;
  let sy = 0;
  let tracking = false;

  panel.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button")) return; // 버튼·링크 클릭은 제외
    tracking = true;
    sx = e.clientX;
    sy = e.clientY;
  });
  panel.addEventListener("pointerup", (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    // 가로로 50px 이상, 세로보다 확실히 많이 움직였을 때만
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      step(dx < 0 ? 1 : -1);
    }
  });
  panel.addEventListener("pointercancel", () => {
    tracking = false;
  });

  /* ===== 키보드 (←, →) : 섹션 안에 포커스가 있을 때 ===== */
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ===== TRACKS 버튼: 수록곡 펼치기/접기 ===== */
  tracksBtn.addEventListener("click", () => {
    const open = tracklist.hidden; // 지금 닫혀 있으면 연다
    tracklist.hidden = !open;
    tracksBtn.setAttribute("aria-expanded", String(open));
  });

  render();
})();


// 06 갤러리 모달팝업
const gallery = {
  SION: [
    "sion06",
    "sion02",
    "sion01",
    "sion03",
    "sion04",
    "sion05",
    "sion09",
    "sion08",
    "sion07",
  ],
  RIKU: [
    "riku07",
    "riku04",
    "riku03",
    "riku02",
    "riku05",
    "riku06",
    "riku01",
    "riku08",
    "riku09",
  ],
  SAKUYA: [
    "sakuya01",
    "sakuya02",
    "sakuya06",
    "sakuya04",
    "sakuya07",
    "sakuya05",
    "sakuya10",
    "sakuya08",
    "sakuya09",
  ],
  YUSHI: [
    "yushi01",
    "yushi02",
    "yushi06",
    "yushi04",
    "yushi05",
    "yushi03",
    "yushi07",
    "yushi08",
    "yushi09",
  ],
  RYO: [
    "ryo07",
    "ryo02",
    "ryo06",
    "ryo04",
    "ryo05",
    "ryo03",
    "ryo09",
    "ryo08",
    "ryo01",
  ],
  JAEHEE: [
    "jaehee01",
    "jaehee06",
    "jaehee03",
    "jaehee02",
    "jaehee05",
    "jaehee04",
    "jaehee07",
    "jaehee08",
    "jaehee09",
  ],
};

// 파일명 -> 경로로 바꿔주기 (확장자는 여기서 한 번만 관리)
Object.keys(gallery).forEach((key) => {
  gallery[key] = gallery[key].map((file) => `img/gallery/${file}.jfif`);
});

// 갤러리 모달
const modal = document.getElementById("gmodal");
const nameEl = modal.querySelector(".gmodal_name");
const gridEl = modal.querySelector(".gmodal_grid");
const closeBtn = modal.querySelector(".gmodal_close");

// 라이트박스
const lb = document.getElementById("glightbox");
const lbImg = lb.querySelector("img");
const lbClose = lb.querySelector(".glightbox_close");

function openGallery(name) {
  const imgs = gallery[name];
  if (!imgs) return;

  nameEl.textContent = name;
  gridEl.innerHTML = imgs
    .map(
      (src, i) => `
      <figure class="item" style="--i:${i}">
        <img src="${src}" alt="${name} ${i + 1}">
      </figure>`,
    )
    .join("");

  modal.classList.add("on");
  document.documentElement.style.overflow = "hidden";
}

function closeGallery() {
  modal.classList.remove("on");
  document.documentElement.style.overflow = "";
  gridEl.innerHTML = "";
}

function openLightbox(src, alt) {
  lbImg.src = src;
  lbImg.alt = alt;
  lb.classList.add("on");
}

function closeLightbox() {
  lb.classList.remove("on");
  lbImg.src = "";
}

// 멤버 사진 클릭 -> 갤러리 열기
document.querySelector(".sec06_cols").addEventListener("click", (e) => {
  const fig = e.target.closest("figure[data-name]");
  if (fig) openGallery(fig.dataset.name);
});

// 갤러리 안 사진 클릭 -> 확대
gridEl.addEventListener("click", (e) => {
  const img = e.target.closest(".item img");
  if (img) openLightbox(img.src, img.alt);
});

// 갤러리 닫기: X 버튼 / 어두운 바깥
closeBtn.addEventListener("click", closeGallery);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeGallery();
});

// 라이트박스 닫기: X 버튼 / 어두운 바깥 / 사진 클릭
lbClose.addEventListener("click", closeLightbox);
lb.addEventListener("click", (e) => {
  if (!e.target.closest(".glightbox_close")) closeLightbox();
});

// ESC: 라이트박스가 열려 있으면 그것만, 아니면 갤러리 닫기
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (lb.classList.contains("on")) closeLightbox();
  else if (modal.classList.contains("on")) closeGallery();
});

// 모바일 - 멤버 프로필 변경
/* ===== 멤버 데이터: 사진, 생일, 컬러를 여기서 고치세요 ===== */
const members = {
  sion: {
    name: "SION",
    img: "img/si.avif",
    birth: "2002.5.11",
    color: "COLOR",
    hex: "#ad17c1",
  },
  riku: {
    name: "RIKU",
    img: "img/ri.avif",
    birth: "2003.6.28",
    color: "COLOR",
    hex: "#c94a4a",
  },
  yushi: {
    name: "YUSHI",
    img: "img/yu.avif",
    birth: "2004.4.5",
    color: "BLUE",
    hex: "#429ce0",
  },
  jaehee: {
    name: "JAEHEE",
    img: "img/ja.avif",
    birth: "2005.6.21",
    color: "COLOR",
    hex: "#199e3a",
  },
  ryo: {
    name: "RYO",
    img: "img/ry.avif",
    birth: "2007.8.4",
    color: "COLOR",
    hex: "#f8f523",
  },
  sakuya: {
    name: "SAKUYA",
    img: "img/sa.avif",
    birth: "2007.11.18",
    color: "COLOR",
    hex: "#ff99f6",
  },
};

/* ===== 요소 ===== */
const memberImg = document.getElementById("member_img");
const memberName = document.getElementById("member_name");
const memberBirth = document.getElementById("member_birth");
const memberColor = document.getElementById("id_color");
const memberDot = document.querySelector(".info_rows .dot");
const mcNow = document.getElementById("mc_now");
const mcTotal = document.getElementById("mc_total");

const keys = Object.keys(members); // sion, riku, yushi ...
const chips = document.querySelectorAll(".only_m a");
const listItems = document.querySelectorAll(".member_list li");

mcTotal.textContent = keys.length;

showMember("yushi");

/* ===== 멤버 바꾸기 ===== */
function showMember(key) {
  const m = members[key];
  if (!m) return;

  memberImg.src = m.img;
  memberImg.alt = m.name;
  memberName.textContent = m.name;
  memberBirth.textContent = m.birth;
  memberColor.textContent = m.color;
  memberDot.style.background = m.hex;
  memberDot.style.background = m.hex;
  document.querySelector(".sec02").style.setProperty("--accent", m.hex);
  mcNow.textContent = keys.indexOf(key) + 1;

  // 모바일 칩: 파란색(active) 이동
  chips.forEach((c) => {
    const on = c.dataset.member === key;
    c.classList.toggle("active", on);
    c.style.color = on ? m.hex : "";
  });

  // 데스크톱 이름 목록: on 이동
  listItems.forEach((li) => {
    li.classList.toggle("on", li.querySelector("a").dataset.member === key);
  });
}

/* ===== 클릭 연결 (칩 + 이름 목록 공통) ===== */
document.querySelectorAll(".only_m a, .member_list a").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    showMember(a.dataset.member);
  });
});

// sec05
/* ===== 공지 ===== */
(function () {
  // 공지 데이터: 새 공지는 맨 위에 한 줄 추가
  const notices = [
    {
      date: "2026.10.24 sat",
      title: "[공지] 261024 (토) NCT WISH MBC 쇼! 음악중심 &lt;I SPY&gt; 사전녹화 참여 안내",
      link: "https://weverse.io/nctwish/highlight",
    },
    {
      date: "2026.10.16 fri",
      title:
        "[공지] ‘INTO THE WISH : Face Our WISH’ 예매 & 입장 주의사항",
      link: "https://weverse.io/nctwish/highlight",
    },
    {
      date: "2026.10.10 mon",
      title: "[공지] NCT WISH 2nd CONCERT TOUR ‘INTO THE WISH : Face Our WISH’ 오픈 안내",
      link: "https://weverse.io/nctwish/highlight",
    },
    {
      date: "2026.10.08 thu",
      title:
        "[공지] NCT WISH 'I SPY' 음악방송 사전투표 안내",
      link: "https://weverse.io/nctwish/highlight",
    },
    // 아래는 2페이지~
    { date: "2026.10.05 fri", title: "[공지] NCT WISH 2nd CONCERT TOUR ‘INTO THE WISH : Face Our WISH’ 투어 일정 안내", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.10.02 tue", title: "[알림] NCT WISH The 4th Mini Album ‘I SPY’ 발매 기념 SPECIAL PHOTO EVENT & 사인회 - 10/31(토) 애플뮤직", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.10.01 thu", title: "[공지] NCT WISH 'I SPY' Listening Party 종료 안내", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.29 sat", title: "[공지] 261022 (목) NCT WISH Mnet 엠카운트다운 사전녹화 참여 안내", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.28 fri", title: "[알림] NCT WISH The 4th Mini Album ‘I SPY’ 발매 기념 VIDEO CALL EVENT - 10/29(목) 케이타운포유", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.25 tue", title: "[알림] NCT WISH The 4th Mini Album ‘I SPY’ 발매 기념 VIDEO CALL EVENT - 10/29(목) 케이타운포유", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.23 thu", title: "[알림] NCT WISH 'I SPY' Listening Party Coming soon ", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.20 sat", title: "[알림] NCT WISH ‘I SPY’ <일요일에 뭐해?> 진행 안내", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.19 fri", title: "[공지] NCT WISH 'I SPY' 음악방송 사전투표 안내", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.18 tue", title: "[공지] NCT WISH 'I SPY' 응원법 안내!", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.17 thu", title: "[알림] NCT WISH The 4th Mini Album ‘I SPY’ 발매 기념 ‘LUCKY DRAW EVENT’ 안내", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.15 sat", title: "[알림] 2027 NCT WISH SEASON’S GREETINGS SALES NOTICE", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.08 fri", title: "[공지] NCT WISH 2nd CONCERT TOUR ‘INTO THE WISH : Face Our WISH’ 투어 일정 안내", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.05 tue", title: "[알림] 2026 NCT WISH The 4th Mini Album ‘I SPY’  EVENT NOTICE", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.02 thu", title: "[공지] NCT WISH 팝업스토어 'WISH LAND' NCTzen WISH 회차 팬클럽 참여 안내", link: "https://weverse.io/nctwish/highlight" },
    { date: "2026.09.01 sat", title: "[공지] [예정된 회의] I SPY ☆ 스포일러 화상 미팅 진행 안내", link: "https://weverse.io/nctwish/highlight" },
  ];

  const PER_PAGE = 5;
  const totalPages = Math.ceil(notices.length / PER_PAGE);
  
  const listEl = document.getElementById("notice_list");
  const pagingEl = document.getElementById("notice_paging");

  if (!listEl || !pagingEl) return;

  let current = 1;

  function render() {
    // 1) 목록
    const start = (current - 1) * PER_PAGE;

    listEl.innerHTML = notices
      .slice(start, start + PER_PAGE)
      .map(
        (n) => `
          <article>
            <a href="${n.link}" data-summary="${String(n.summary || "").replace(/"/g, "&quot;")}">
              <span class="date">${n.date}</span>
              <p>${n.title}</p>
            </a>
          </article>`,
      )
      .join("");

    // 2) 페이지 버튼
    // 페이지 버튼
    let html = `<a href="#" class="${current === 1 ? "off" : ""}" data-go="${current - 1}">&lt;</a>`;

    for (let i = 1; i <= totalPages; i++) {
      html += `<a href="#" data-go="${i}"${i === current ? ' class="on"' : ""}>${i}</a>`;
    }

    html += `<a href="#" class="next ${current === totalPages ? "off" : ""}" data-go="${current + 1}">&gt;</a>`;

    pagingEl.innerHTML = html;
  }

  // 3) 클릭은 paging 한 곳에서 처리
  pagingEl.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-go]");
    if (!a) return;

    e.preventDefault();

    if (a.classList.contains("off")) return;

    current = Number(a.dataset.go);
    render();
  });

  render();
})();

// 아이프레임 뮤비
const playBtn = document.querySelector(".play_btn");
const videoModal = document.querySelector(".video_modal");
const videoCloseBtn = document.querySelector(".close_btn");
const videoIframe = videoModal.querySelector("iframe");

const videoURL = "https://www.youtube.com/embed/xIlFjHHUfI0?autoplay=1";

// 플레이 버튼 클릭
playBtn.addEventListener("click", (e) => {
  e.preventDefault();
  videoModal.hidden = false;
  videoIframe.src = videoURL;
});

// 닫기 버튼 클릭
videoCloseBtn.addEventListener("click", closeModal);

// 모달 바깥 배경 클릭
videoModal.addEventListener("click", (e) => {
  if (e.target === videoModal) {
    closeModal();
  }
});

// ESC 키로 닫기
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !videoModal.hidden) {
    closeModal();
  }
});

// 모달 닫기 및 영상 정지
function closeModal() {
  videoModal.hidden = true;
  videoIframe.src = "";
}

// 유튜브 더보기 버튼
document.querySelector(".moreBtn").addEventListener("click", function (e) {
  const extra = document.querySelector(".video_extra");

  // 처음 클릭: 영상 펼치고 버튼을 채널 링크로 변경
  if (!extra.classList.contains("active")) {
    e.preventDefault();
    e.stopPropagation();

    extra.classList.add("active");
    this.textContent = "YouTube ↗";
    this.href = "https://www.youtube.com/@NCTWISH";
    this.target = "_blank";
    this.rel = "noopener noreferrer";
  }
  // 두 번째 클릭부터는 링크로 이동
});

//sec04
// VIDEO 썸네일 아이프레임 모달
const youtubeModal = document.querySelector(".youtube_modal");
const youtubeIframe = document.querySelector(".youtube_wrap iframe");
const youtubeCloseBtn = document.querySelector(".youtube_close");

const videoBtns = document.querySelectorAll(".sec04 figure a[data-video]");

// 썸네일 클릭
videoBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const videoURL = btn.dataset.video;

    youtubeIframe.src = videoURL + "?autoplay=1";
    youtubeModal.hidden = false;
  });
});

// 닫기 버튼
youtubeCloseBtn.addEventListener("click", closeYoutubeModal);

// 모달 바깥 클릭
youtubeModal.addEventListener("click", (e) => {
  if (e.target === youtubeModal) {
    closeYoutubeModal();
  }
});

// ESC 키로 닫기
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !youtubeModal.hidden) {
    closeYoutubeModal();
  }
});

// 모달 닫기 + 영상 정지
function closeYoutubeModal() {
  youtubeModal.hidden = true;
  youtubeIframe.src = "";
}

// =========헤더 gnb 메뉴 팝업 ==============
const root = document.documentElement;
const menuBtn = document.querySelector('.hamburger button');
const menu = document.querySelector('.menu_modal');

function toggleMenu(open) {
  const willOpen = open === undefined ? !menu.classList.contains('on') : open;
  menu.classList.toggle('on', willOpen);
  menuBtn.classList.toggle('on', willOpen);
  root.classList.toggle('menu_open', willOpen);
  menuBtn.setAttribute('aria-expanded', willOpen);
  menu.setAttribute('aria-hidden', !willOpen);
}

menuBtn.addEventListener('click', () => toggleMenu());

// ESC로 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleMenu(false);
});

// 메뉴 클릭: 닫고 해당 섹션으로 이동
menu.querySelectorAll('a[data-target]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.dataset.target);
    toggleMenu(false);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  });
});