const { useState, useEffect } = React;

const categories = [
  { id: 1, name: 'الهندسة المدنية', slug: 'civil' },
  { id: 2, name: 'الهندسة المعمارية', slug: 'architecture' },
  { id: 3, name: 'الهندسة الميكانيكية', slug: 'mechanical' },
  { id: 4, name: 'الهندسة الكهربائية', slug: 'electrical' },
  { id: 5, name: 'الهندسة الإلكترونية', slug: 'electronics' },
  { id: 6, name: 'هندسة النفط', slug: 'petroleum' },
  { id: 7, name: 'البرمجة', slug: 'programming' },
  { id: 8, name: 'شروحات برامج متنوعة', slug: 'software' },
];

const initialCourses = categories.reduce((acc, cat) => {
  acc[cat.slug] = Array.from({ length: 12 }, (_, i) => ({
    id: `${cat.slug}-${i + 1}`,
    name: `كورس ${cat.name} ${i + 1}`,
    price: 500,
    image: `images/${(cat.id - 1) * 12 + i + 1}.jpg`,
  }));
  return acc;
}, {});

// تخزين الكورسات في localStorage
const getCourses = () => {
  const stored = localStorage.getItem('courses');
  return stored ? JSON.parse(stored) : initialCourses;
};

const saveCourses = (courses) => {
  localStorage.setItem('courses', JSON.stringify(courses));
};

// المكون الرئيسي
const App = () => {
  const [courses, setCourses] = useState(getCourses());
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

  const renderHeader = () => (
    <div id="headerCarousel" className="carousel slide header-carousel" data-bs-ride="carousel">
      <div className="carousel-inner">
        {[1, 2, 3].map((i) => (
          <div className={`carousel-item ${i === 1 ? 'active' : ''}`} key={i}>
            <img src={`images/carousel${i}.jpg`} className="d-block w-100" alt={`Slide ${i}`} />
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#headerCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#headerCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
  );

  const renderFooter = () => (
    <footer className="footer">
      <p>تواصلوا معنا عبر واتساب:</p>
      <a href="https://wa.me/201287027277"><i className="fab fa-whatsapp"></i></a>
      <a href="https://wa.me/249912500618"><i className="fab fa-whatsapp"></i></a>
      <a href="https://wa.me/249100112244"><i className="fab fa-whatsapp"></i></a>
    </footer>
  );

  const renderHome = () => (
    <div>
      {renderHeader()}
      <div className="container my-5">
        <h1 className="text-center mb-5">كورسات يودمي الهندسية المعتمدة</h1>
        {categories.map((category) => (
          <div key={category.id} className="mb-5">
            <h2>{category.name}</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {courses[category.slug].slice(0, 4).map((course) => (
                <div key={course.id} className="col">
                  <div className="course-card card h-100">
                    <img src={course.image} className="card-img-top" alt={course.name} />
                    <div className="card-body">
                      <h5 className="card-title">{course.name}</h5>
                      <p className="card-text">السعر: {course.price} جنيه</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <a href={`/${category.slug}`} className="btn btn-more">مزيد من الكورسات</a>
            </div>
          </div>
        ))}
      </div>
      {renderFooter()}
    </div>
  );

  const renderCategoryPage = (slug) => {
    const category = categories.find((cat) => cat.slug === slug);
    if (!category) return <div>الصفحة غير موجودة</div>;

    return (
      <div>
        {renderHeader()}
        <div className="container my-5">
          <h1 className="text-center mb-5">{category.name}</h1>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {courses[slug].map((course) => (
              <div key={course.id} className="col">
                <div className="course-card card h-100">
                  <img src={course.image} className="card-img-top" alt={course.name} />
                  <div className="card-body">
                    <h5 className="card-title">{course.name}</h5>
                    <p className="card-text">السعر: {course.price} جنيه</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {renderFooter()}
      </div>
    );
  };

  const renderAdminPanel = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: '', category: 'civil', image: '' });

    const handleLogin = () => {
      if (password === 'admin123') setIsAuthenticated(true);
      else alert('كلمة المرور غير صحيحة');
    };

    const handleAddCourse = () => {
      const updatedCourses = { ...courses };
      const newId = `${newCourse.category}-${courses[newCourse.category].length + 1}`;
      updatedCourses[newCourse.category].push({
        id: newId,
        name: newCourse.name,
        price: 500,
        image: newCourse.image || `images/${Math.floor(Math.random() * 150) + 1}.jpg`,
      });
      setCourses(updatedCourses);
      setNewCourse({ name: '', category: 'civil', image: '' });
    };

    const handleDeleteCourse = (category, courseId) => {
      const updatedCourses = { ...courses };
      updatedCourses[category] = updatedCourses[category].filter((course) => course.id !== courseId);
      setCourses(updatedCourses);
    };

    if (!isAuthenticated) {
      return (
        <div className="admin-panel">
          <h2>تسجيل الدخول</h2>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleLogin}>
            دخول
          </button>
        </div>
      );
    }

    return (
      <div className="admin-panel">
        <h2>لوحة الإدارة</h2>
        <h3>إضافة كورس جديد</h3>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="اسم الكورس"
          value={newCourse.name}
          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
        />
        <select
          className="form-control mb-3"
          value={newCourse.category}
          onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
        >
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="رابط الصورة (اختياري)"
          value={newCourse.image}
          onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
        />
        <button className="btn btn-success mb-5" onClick={handleAddCourse}>
          إضافة الكورس
        </button>

        <h3>إدارة الكورسات</h3>
        {categories.map((cat) => (
          <div key={cat.slug}>
            <h4>{cat.name}</h4>
            <ul className="list-group mb-3">
              {courses[cat.slug].map((course) => (
                <li key={course.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {course.name}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteCourse(cat.slug, course.id)}
                  >
                    حذف
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  // التوجيه البسيط
  if (path === '/admin') return renderAdminPanel();
  if (path.startsWith('/')) {
    const slug = path.slice(1);
    if (categories.some((cat) => cat.slug === slug)) return renderCategoryPage(slug);
  }
  return renderHome();
};

// التوجيه عند تغيير المسار
window.addEventListener('popstate', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

ReactDOM.render(<App />, document.getElementById('root'));
