import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

const Reviews = () => {
  return (
    <div className="shadow-md w-[80%] py-5 px-8 rounded-md">
      <div className="w-full productReviewsContainer">
        <h2 className="text-[18px] font-semibold">
          Customer questions & answers
        </h2>
        <div className="reviewScroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden mt-5 pr-5">
          <div className="review pt-5 pb-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between">
            <div className="info w-[60%] flex items-center gap-3">
              <div className="img w-20 h-20 overflow-hidden rounded-full">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHOyweUERP_PkAHflHnp-jMxGTx_D-DD638A&s"
                  className="w-full"
                />
              </div>

              <div className="w-[80%]">
                <h4 className="text-[16px] font-semibold">MD MERAJ</h4>
                <h5 className="text-[13px] mb-0 font-medium">2025-08-18</h5>
                <p className="mt-0 mb-0 font-normal">This website is osm ☺️</p>
              </div>
            </div>
            <Rating name="size-small" defaultValue={2} size="small" readOnly />
          </div>
        </div>

        <br />

        <div className="reviewForm bg-[#fafafa] p-4 rounded-md">
          <h2 className="text-[18px] font-medium">Add a review</h2>

          <form className="w-full mt-5">
            <TextField
              id="outlined-multiline-flexible"
              label="Write a review..."
              className="w-full"
              multiline
              rows={5}
            />
            <br />
            <br />
            <Rating name="size-small" defaultValue={1} size="small" />

            <div className="flex items-center mt-5">
              <Button className="btn-org">Submit Review</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
