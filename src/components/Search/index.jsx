import { IoSearch } from 'react-icons/io5';
import Button from '@mui/material/Button';

const Search = () => {
  return (
    <div className="searchBox flex h-12 w-full items-center overflow-hidden rounded-md bg-gray-100">
      <input
        type="text"
        placeholder="Search for products..."
        className="flex-1 bg-transparent px-4 text-[15px] placeholder-gray-600 focus:outline-none"
      />
      <Button
        sx={{
          minWidth: '40px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4e4e4e',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <IoSearch size={22} />
      </Button>
    </div>
  );
};

export default Search;
