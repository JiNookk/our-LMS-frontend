import {
  fireEvent,
  render, screen, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import InquiryBoard from './InquiryBoard';

delete window.location;
window.location = new URL('http://localhost:8080/courses/1/lectures/1');

const onNavigate = jest.fn();

describe('InquiryBoard', () => {
  beforeEach(() => {
    render((
      <MemoryRouter>
        <InquiryBoard onNavigate={onNavigate} />
      </MemoryRouter>
    ));
  });

  it('renders screen', async () => {
    screen.getByText('질문 게시판');
    screen.getByLabelText('강의 시간');
    screen.getByLabelText('검색');
    screen.getByText('검색하기');
    fireEvent.click(screen.getByText('글 작성하기'));

    screen.getByText('질문이 존재하지 않습니다.');

    await waitFor(() => {
      expect(onNavigate).toBeCalledWith({ tab: 'post', ids: { courseId: 1, lectureId: 1 } });
      screen.getByText('제목 1');
      screen.getAllByText(/작성자/);
    });
  });
});
