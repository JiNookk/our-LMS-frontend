import ReactPlayer from 'react-player';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect } from 'react';
import useProgressStore from '../hooks/useProgressStore';
import useLectureStore from '../hooks/useLectureStore';
import useVideoStore from '../hooks/useVideoStore';
import useSectionStore from '../hooks/useSectionStore';

const Container = styled.div`
  width: 100%;
  
  color: white;
  background-color: black;
`;

const Heading = styled.div`
  padding-left: 1rem;
  font-size: 1.5rem;

  height: 4rem;
  line-height: 4rem;
  background-color: rgb(33,37,41);

  h2{
    display: inline-block;

    margin-left: 2rem;
  }

  a{
    font-size: 1rem;
    color: white
  }
`;

const Media = styled.div`
  padding-inline : 2rem ;
`;

const ButtonContainer = styled.article`
  padding-left: 5rem;
  font-size: 1.5rem;

  height: 3rem;
  line-height: 3rem;

  text-align: center;
  background-color : rgb(95,95,95);  

  button{
    font-size: 1rem;
    background: none;
    border: none;

    margin-inline-end: 2rem;
    color: white;
  }
`;

export default function Lecture() {
  const navigate = useNavigate();

  const courseId = window.location.pathname.split('/')[2];
  const lectureId = window.location.pathname.split('/')[4];

  const lectureStore = useLectureStore();
  const sectionStore = useSectionStore();
  const videoStore = useVideoStore();
  const progressStore = useProgressStore();

  useEffect(() => {
    lectureStore.fetchLectures({ courseId });
    lectureStore.fetchLecture({ courseId, lectureId });
  }, []);

  const handleLectureComplete = () => {
    progressStore.completeLecture({ progressId: progressStore.progress.id })
      .then(() => {
        sectionStore.fetchSections({ courseId });
        progressStore.fetchProgresses({ courseId });
      });
  };

  const handlePreviousLecture = () => {
    const previousLecture = lectureStore.previousLecture({ lectureId });

    navigate(`/courses/${courseId}/lectures/${previousLecture.id}`, {
      state: { courseId, lectureId: previousLecture.id },
    });
  };

  const handleNextLecture = () => {
    const nextLecture = lectureStore.nextLecture({ lectureId });

    navigate(`/courses/${courseId}/lectures/${nextLecture.id}`, {
      state: { courseId, lectureId: nextLecture.id },
    });
  };

  useEffect(() => {
    progressStore.fetchProgress({ lectureId });
  }, []);

  return (
    <Container>
      <Heading>
        <Link to={`/courses/${courseId}`}>
          {'?????? ????????????  '}
        </Link>
        <h2>
          {lectureStore.lecture.title}
        </h2>
      </Heading>
      <Media>
        <ReactPlayer
          id="react-player"
          url={`https://www.youtube.com/watch?v=${lectureStore.lecture.videoUrl}`}
          ref={videoStore.ref}
          playing={videoStore.isPlay}
          controls={videoStore.control}
          width={videoStore.width}
          height={videoStore.height}
          onEnded={handleLectureComplete}
        />
      </Media>
      <ButtonContainer>
        {lectureStore.previousLecture({ lectureId }).id && (
          <button type="button" onClick={handlePreviousLecture}>
            {'< ?????? ??????'}
          </button>
        )}
        {lectureStore.nextLecture({ lectureId }).id && (
          <button type="button" onClick={handleNextLecture}>
            {'?????? ?????? >'}
          </button>
        )}
      </ButtonContainer>
    </Container>
  );
}
