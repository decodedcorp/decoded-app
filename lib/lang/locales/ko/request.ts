export const request = {
  steps: {
    messages: {
      upload: '이미지를 업로드해주세요',
      marker: '찾고 싶은 아이템을 선택해주세요',
      context: '사진에 대한 더 많은 정보를 알려주세요',
    },
    upload: {
      title: '이미지 업로드',
      description: '찾고 싶은 아이템이 있는 이미지를 업로드해주세요',
      guide: {
        required: {
          title: '필수 입력사항',
          description: '아이템을 찾고 싶은 이미지를 업로드해주세요',
        },
        help: {
          title: '도움말',
          items: ['최대 5MB까지 업로드 가능', 'jpg, jpeg, png 형식만 가능'],
        },
      },
    },
    marker: {
      title: '아이템 선택',
      description: '찾고 싶은 아이템을 선택해주세요',
      guide: {
        required: {
          title: '필수 입력사항',
          description: [
            '이미지를 클릭하여 궁금한 아이템의 위치를 표시해주세요',
            '최소 1개 이상의 아이템을 선택해야 합니다',
          ],
        },
        help: {
          title: '도움말',
          items: [
            '선택한 위치를 삭제하려면 마커에 마우스를 올린 후 X 버튼을 클릭하세요',
            '선택한 아이템에 대한 설명은 아이템 정보에 도움이 됩니다',
          ],
        },
      },
      marker: {
        title: '선택한 아이템 목록',
        placeholder: '설명을 입력해주세요',
        list: {
          title: '이미지 위에 위치를 표시해주세요',
        },
      },
    },
    context: {
      title: '추가 정보',
      description: '사진에 대한 더 많은 정보를 알려주세요',
      guide: {
        required: {
          title: '필수 입력사항',
          description:
            '추가 정보를 입력해 주세요. 사진의 맥락을 강화하는 데 사용됩니다.',
        },
        optional: {
          title: '선택 입력사항',
          description: '이 사진은 어디에서 촬영되었나요? 출처는 무엇인가요?',
        },
      },
      questions: {
        location: {
          title: '이 사진은 어디에서 촬영되었나요?',
          options: {
            airport: '공항',
            concert: '콘서트장',
            event: '행사장',
            casual: '일상',
            studio: '스튜디오',
          },
        },
        source: {
          title: '이 이미지의 출처는 무엇인가요?',
          placeholder: '출처 정보를 입력해주세요',
          options: {
            sns: 'SNS에서 가져옴 (예: 인스타그램, 트위터)',
            personal: '개인적으로 촬영한 사진',
            news: '뉴스나 블로그에서 가져옴',
          },
        },
      },
    },
  },
  modal: {
    confirmClose: {
      title: '작업 취소',
      message: '작업 중인 내용이 사라집니다. 정말 닫으시겠습니까?',
      confirm: '닫기',
      cancel: '계속 작업하기'
    },
    confirmExitCropper: {
      title: '편집 취소',
      message: '편집 내용이 저장되지 않습니다. 편집을 취소하시겠습니까?',
      confirm: '취소하기',
      cancel: '계속 편집하기'
    }
  },
  validation: {
    login: '로그인이 필요합니다',
    image: '이미지를 업로드해주세요',
    markers: '최소 1개 이상의 아이템을 선택해주세요',
    submit: {
      success: '요청이 성공적으로 제출되었습니다',
      error: '요청 제출에 실패했습니다',
      unknown: '알 수 없는 오류가 발생했습니다',
    },
  },
} as const;
