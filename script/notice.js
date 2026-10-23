(() => {
  const listEl = document.getElementById("notice_list");
  const modal = document.querySelector(".notice_modal");
  if (!listEl || !modal) return;

  const q = (sel) => modal.querySelector(sel);
  const closeBtn = q(".ticket_close");
  let lastFocus = null;

  // "2026.09.21 mon" → 연도 / 월.일 / 요일 / 번호
  const parseDate = (text) => {
    const m = text.match(/(\d{4})\.(\d{2})\.(\d{2})\s*([A-Za-z]+)?/);
    if (!m) return { year: "", md: text, day: "", no: "" };
    return {
      year: m[1],
      md: `${m[2]}.${m[3]}`,
      day: (m[4] || "").toUpperCase(),
      no: `${m[2]}${m[3]}`,
    };
  };

  const openNotice = (a) => {
    const dateEl = a.querySelector(".date");
    const titleEl = a.querySelector("p");
    if (!dateEl || !titleEl) return;

    const d = parseDate(dateEl.textContent.trim());

    q(".ticket_title").textContent = titleEl.textContent.trim();
    q(".ticket_sum").textContent =
      a.dataset.summary || "자세한 공지 내용은 Weverse에서 확인해 주세요. \n";
    q(".stub_year").textContent = d.year;
    q(".stub_date").textContent = d.md;
    q(".stub_day").textContent = d.day;
    q(".stub_no").textContent = d.no ? `No. ${d.no}` : "";
    q(".ticket_btn").href = a.href;

    lastFocus = a;
    modal.hidden = false;
    document.body.classList.add("modal_open");
    closeBtn.focus();
  };

  const closeNotice = () => {
    modal.hidden = true;
    document.body.classList.remove("modal_open");
    if (lastFocus) lastFocus.focus();
  };

  // 공지 클릭 (페이지를 넘겨서 새로 그려져도 동작)
  listEl.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || !listEl.contains(a)) return;
    e.preventDefault();
    openNotice(a);
  });

  closeBtn.addEventListener("click", closeNotice);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeNotice();
  });

  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;

    if (e.key === "Escape") {
      closeNotice();
      return;
    }

    // Tab 키가 팝업 밖으로 나가지 않게
    if (e.key === "Tab") {
      const f = [...modal.querySelectorAll("a[href], button")];
      const first = f[0];
      const last = f[f.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();