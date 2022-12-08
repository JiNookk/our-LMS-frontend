import CoursesStore from './CoursesStore';

const context = describe;

describe('CoursesStore', () => {
  let coursesStore;

  beforeEach(() => {
    coursesStore = new CoursesStore();
  });

  describe('fetchMyCourses', () => {
    it('requests my courses data', () => {
      coursesStore.fetchMyCourses();

      expect(coursesStore).toBeTruthy();
    });
  });
});