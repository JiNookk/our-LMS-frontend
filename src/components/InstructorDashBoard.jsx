import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import useCourseStore from '../hooks/useCourseStore';
import useInquiryStore from '../hooks/useInquiryStore';
import useLectureStore from '../hooks/useLectureStore';
import usePaymentStore from '../hooks/usePaymentStore';
import useRatingStore from '../hooks/useRatingStore';
import Chart from '../utils/Chart';
import { dateFormat } from '../utils/DateFormat';

import percentageFormat from '../utils/percentageFormat';

const Container = styled.div`
  width: 100%;

  padding-inline-end: 2rem;
  padding-block: 2rem;

  h2{
    font-size: 2rem;
    font-weight: bold;
  }
`;

const Preview = styled.div`
  display: grid;
  grid: 170px 170px / 1fr 1fr 1fr;
  gap: 15px;
  margin-block-end: 2rem;
  width: 100%;

  article{
    border: 1px solid black;
    background-color: white;
  }

  article:nth-child(5){
    grid-area: 2 / 2 / 3 / 4;
  }
`;

const MonthlyRevenue = styled.div`
  display: grid;
  grid: 400px / 1fr 1fr;
  gap: 15px;
  width: 100%;

  margin-block-end: 2rem;

  article{
    border: 1px solid black;

    background-color: white;
  }
`;

const Category = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;

  display: inline-block;
`;

const UnRepliedInquiries = styled.article`
  width: 100%;
  height: 400px;
  background-color: white;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
export default function InstructorDashBoard() {
  const courseStore = useCourseStore();
  const ratingStore = useRatingStore();
  const paymentStore = usePaymentStore();
  const inquiryStore = useInquiryStore();
  const lectureStore = useLectureStore();

  useEffect(() => {
    courseStore.fetchUploadedCourses();
    ratingStore.fetchRating();
    paymentStore.fetchPayments();
    paymentStore.fetchMonthlyPayments();
    inquiryStore.fetchInquiriesByInstructorId();
    lectureStore.fetchLecturesByInstructorId();
  }, []);

  return (
    <Container>
      <Preview>
        <article>
          <Category>
            My Home
          </Category>
        </article>
        <article>
          <Category>
            ??? ?????? ???
          </Category>
          <div>
            {courseStore.uploadedCourses?.length || 0}
            ???
          </div>
        </article>
        <article>
          <Category>
            ??????
          </Category>
          <div>
            {percentageFormat(ratingStore.rating / 100)}
          </div>
        </article>
        <article>
          <Category>
            ??? ????????? ???
          </Category>
          <div>
            {paymentStore.payments.length}
            ???
          </div>
        </article>
        <article>
          <Category>
            ?????? ??? ??????
          </Category>
          {paymentStore.payments
            .reduce((cur, acc) => cur + acc.cost, 0)}
          ???
        </article>
      </Preview>

      <h2>?????? ??????</h2>
      <MonthlyRevenue>
        <article>
          <Category>
            ?????? ??? ??????
          </Category>
          <Chart
            cost={paymentStore.monthlyProfit}
            ratioArray={paymentStore.recentPayments
              .map((payment) => ({
                name: payment.courseTitle,
                value: payment.cost,
              }))}
          />
        </article>
        <article>
          <Category>
            ?????? ?????? ??????
          </Category>
        </article>
      </MonthlyRevenue>
      <UnRepliedInquiries>
        <TextContainer>
          <Category>
            ????????? ??????
          </Category>
          <Link to="/instructor/questions">
            ?????? ?????? ??????
          </Link>
        </TextContainer>
        <ul>
          {inquiryStore.inquiryPosts
            .filter((inquiry) => inquiry.status.replied === 'processing')
            .map((inquiry) => (
              <li key={inquiry.id}>
                <h3>
                  {// ??? ?????? ?????? ????????? ??? ??????.
                    courseStore.uploadedCourses
                      .find((course) => {
                        const found = lectureStore.lectures
                          .find((lecture) => lecture.id === inquiry.lectureId);
                        return course.id === found?.courseId;
                      })
                      ?.title
                  }
                  {' '}
                  -
                  {' '}
                  {lectureStore.lectures
                    .find((lecture) => lecture.id === inquiry.lectureId)
                    ?.title}
                </h3>
                <TextContainer>
                  <p>{inquiry.publisher}</p>
                  <p>
                    {inquiry.title}
                    {'  '}
                    {dateFormat.fromNow(inquiry.publishTime)}
                  </p>
                </TextContainer>
              </li>
            ))}
        </ul>
      </UnRepliedInquiries>
    </Container>
  );
}
