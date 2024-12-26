function RequestSection() {
    const handleRequest = () => {
      const userDocId = window.sessionStorage.getItem("USER_DOC_ID");
      if (!userDocId) {
        alert("해당기능은 준비중입니다.");
        return;
      }
      (document.getElementById("my_modal_1") as HTMLDialogElement)?.showModal();
    };
  
    return (
      <div
        className={`flex flex-col w-full text-xl md:text-2xl justify-center ${regular_font.className} my-20`}
      >
        <div
          className={`flex flex-col p-20 items-center justify-center bg-[#212124] opacity-80`}
        >
          좋아하는 셀럽의 아이템이 궁금하다면?
          <Button
            style={{
              color: "white",
              border: "1px solid white",
              width: "200px",
              height: "40px",
              marginTop: "40px",
            }}
            onClick={() => handleRequest()}
          >
            요청하기
          </Button>
        </div>
        <RequestModal />
      </div>
    );
  }