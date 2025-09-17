'use client';

import React, { useState } from 'react';
import { SimpleModal } from '@/lib/components/ui/modal/SimpleModal';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalClose,
} from '@/lib/components/ui/modal';

/**
 * 모달 클릭 이벤트 테스트 컴포넌트
 *
 * 테스트 목적:
 * 1. 오버레이 클릭으로 모달 닫기
 * 2. 닫기 버튼 클릭
 * 3. ESC 키로 모달 닫기
 * 4. 내부 컨텐츠 클릭 시 모달이 닫히지 않는지 확인
 * 5. 여러 모달 중첩 시 동작 확인
 */
export function ModalClickTest() {
  const [simpleModalOpen, setSimpleModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [nestedModalOpen, setNestedModalOpen] = useState(false);

  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">모달 클릭 이벤트 테스트</h1>
        <p className="text-gray-600 mb-4">
          리팩토링 후 모달의 클릭 이벤트가 정상적으로 동작하는지 테스트합니다.
        </p>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setSimpleModalOpen(true);
              addTestResult('SimpleModal 열기');
            }}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
          >
            Simple Modal 테스트
          </button>

          <button
            onClick={() => {
              setConfirmModalOpen(true);
              addTestResult('ConfirmModal 열기');
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Confirm Modal 테스트
          </button>

          <button
            onClick={() => {
              setCustomModalOpen(true);
              addTestResult('Custom Modal 열기');
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Custom Modal 테스트
          </button>

          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            결과 지우기
          </button>
        </div>

        {/* 테스트 결과 로그 */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">테스트 결과 로그:</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">아직 테스트 결과가 없습니다.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono bg-white p-2 rounded">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SimpleModal 테스트 */}
      <SimpleModal
        isOpen={simpleModalOpen}
        onClose={() => {
          setSimpleModalOpen(false);
          addTestResult('SimpleModal 닫힘');
        }}
      >
        <div className="space-y-4">
          <p>이 모달을 다음 방법들로 닫아보세요:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>✅ ESC 키 누르기</li>
            <li>✅ 오버레이(배경) 클릭하기</li>
            <li>✅ X 버튼 클릭하기</li>
            <li>❌ 이 내용 영역 클릭 (닫히면 안됨)</li>
          </ul>

          <button
            onClick={() => {
              setNestedModalOpen(true);
              addTestResult('중첩 모달 열기');
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            중첩 모달 열기
          </button>

          <button
            onClick={() => addTestResult('내부 버튼 클릭 - 모달이 닫히면 안됨')}
            className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            내부 버튼 테스트
          </button>
        </div>
      </SimpleModal>

      {/* ConfirmModal 테스트 - SimpleModal로 대체 */}
      <SimpleModal
        isOpen={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          addTestResult('ConfirmModal 닫힘');
        }}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">확인 모달 테스트</h3>
          <p className="mb-6">이 작업을 수행하시겠습니까? (테스트용)</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                addTestResult('취소 버튼 클릭');
                setConfirmModalOpen(false);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              취소
            </button>
            <button
              onClick={() => {
                addTestResult('확인 버튼 클릭');
                setConfirmModalOpen(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        </div>
      </SimpleModal>

      {/* Custom Modal 테스트 */}
      <Modal
        open={customModalOpen}
        onOpenChange={(open) => {
          setCustomModalOpen(open);
          addTestResult(`Custom Modal ${open ? '열림' : '닫힘'}`);
        }}
        variant="center"
        size="lg"
      >
        <ModalOverlay onClick={() => addTestResult('Custom Modal 오버레이 클릭')}>
          <ModalContent>
            <ModalHeader>
              <h2 className="text-lg font-semibold">Custom Modal 테스트</h2>
              <ModalClose onClick={() => addTestResult('Custom Modal X 버튼 클릭')} />
            </ModalHeader>

            <ModalBody>
              <div className="space-y-4">
                <p>이것은 커스텀 모달 컴포넌트입니다.</p>
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm">
                    🧪 <strong>테스트 항목:</strong>
                  </p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• 모달 내부 클릭 시 닫히지 않음</li>
                    <li>• 오버레이 클릭 시 닫힘</li>
                    <li>• ESC 키로 닫힘</li>
                    <li>• X 버튼으로 닫힘</li>
                  </ul>
                </div>

                <button
                  onClick={() => addTestResult('Custom Modal 내부 버튼 클릭')}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
                >
                  내부 버튼 (닫히면 안됨)
                </button>
              </div>
            </ModalBody>

            <ModalFooter>
              <button
                onClick={() => {
                  setCustomModalOpen(false);
                  addTestResult('Custom Modal 완료 버튼으로 닫기');
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                완료
              </button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      {/* 중첩 모달 테스트 */}
      <SimpleModal
        isOpen={nestedModalOpen}
        onClose={() => {
          setNestedModalOpen(false);
          addTestResult('중첩 모달 닫힘');
        }}
      >
        <p>이 모달을 닫으면 이전 모달이 다시 보여야 합니다.</p>
        <button
          onClick={() => addTestResult('중첩 모달 내부 버튼 클릭')}
          className="mt-4 px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500"
        >
          중첩 모달 내부 버튼
        </button>
      </SimpleModal>
    </div>
  );
}

export default ModalClickTest;
