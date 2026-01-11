'use client'
import '../styles/PageNumber.css';

const Pagination = ({ currentPage = 1, totalPages = 10, onPageChange }) => {
  
  // Hàm xử lý logic hiển thị số trang (1 2 3 ... 10)
  const generatePagination = () => {
    const pages = [];
    
    // Nếu tổng trang ít (<= 7), hiện tất cả
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Nếu tổng trang nhiều, cần xử lý dấu "..."
    // Luôn hiện trang 1 và trang cuối
    if (currentPage <= 4) {
      // Trường hợp đang ở mấy trang đầu: 1 2 3 4 5 ... 10
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Trường hợp đang ở mấy trang cuối: 1 ... 6 7 8 9 10
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      // Trường hợp ở giữa: 1 ... 4 5 6 ... 10
      pages.push(1);
      pages.push('...');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = generatePagination();

  return (
    <div className='container'>
      {/* Nút Về đầu (First) */}
      <button 
        className='pageBtn navBtn'
        onClick={() => onPageChange && onPageChange(1)}
        disabled={currentPage === 1}
      >
        &#171; {/* Ký tự << */}
      </button>

      {/* Nút Lùi (Prev) */}
      <button 
        className='pageBtn navBtn'
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &#9664; {/* Ký tự mũi tên trái đậm */}
      </button>

      {/* Danh sách số trang */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return <span key={index} className='dots'>...</span>;
        }

        return (
          <button
            key={index}
            className={`pageBtn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange && onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      {/* Nút Tiến (Next) */}
      <button 
        className='pageBtn navBtn'
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &#9654; {/* Ký tự mũi tên phải đậm */}
      </button>

      {/* Nút Về cuối (Last) */}
      <button 
        className='pageBtn navBtn'
        onClick={() => onPageChange && onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        &#187; {/* Ký tự >> */}
      </button>
    </div>
  );
};

export default Pagination;