import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <img 
          src="https://ssau.ru/i/logo/logo_white_goriz_ru.svg" 
          alt="SSAU Logo" 
          className="h-12 mr-40"
        />
        <h1 className="text-2xl font-bold">Расписание занятий</h1>
      </div>
    </header>
  );
};

export default Header;