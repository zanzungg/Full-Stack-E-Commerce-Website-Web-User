import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

const Reviews = () => {
  return (
    <div className="shadow-md w-full md:w-[80%] py-4 md:py-5 px-4 md:px-8 rounded-md">
      <div className="w-full productReviewsContainer">
        <h2 className="text-[16px] md:text-[18px] font-semibold">
          Customer questions & answers
        </h2>
        <div className="reviewScroll w-full max-h-[250px] md:max-h-[300px] overflow-y-scroll overflow-x-hidden mt-4 md:mt-5 pr-2 md:pr-5">
          <div className="review pt-3 md:pt-5 pb-3 md:pb-5 border-b border-[rgba(0,0,0,0.1)] w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="info w-full md:w-[60%] flex items-center gap-2 md:gap-3">
              <div className="img w-12 h-12 md:w-20 md:h-20 overflow-hidden rounded-full flex-shrink-0">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHOyweUERP_PkAHflHnp-jMxGTx_D-DD638A&s"
                  className="w-full h-full object-cover"
                  alt="Reviewer"
                />
              </div>

              <div className="flex-1">
                <h4 className="text-[14px] md:text-[16px] font-semibold">
                  MD MERAJ
                </h4>
                <h5 className="text-[11px] md:text-[13px] mb-0 font-medium">
                  2025-08-18
                </h5>
                <p className="mt-0 mb-0 font-normal text-[12px] md:text-[14px]">
                  This website is osm ☺️
                </p>
              </div>
            </div>
            <Rating
              name="size-small"
              defaultValue={2}
              size="small"
              readOnly
              sx={{
                '& .MuiRating-icon': {
                  fontSize: { xs: '1rem', md: '1.25rem' },
                },
              }}
            />
          </div>
        </div>

        <br />

        <div className="reviewForm bg-[#fafafa] p-3 md:p-4 rounded-md">
          <h2 className="text-[16px] md:text-[18px] font-medium">
            Add a review
          </h2>

          <form className="w-full mt-4 md:mt-5">
            <TextField
              id="outlined-multiline-flexible"
              label="Write a review..."
              className="w-full"
              multiline
              rows={4}
              size="small"
            />
            <br />
            <br />
            <Rating
              name="size-small"
              defaultValue={1}
              size="small"
              sx={{
                '& .MuiRating-icon': {
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                },
              }}
            />

            <div className="flex items-center mt-4 md:mt-5">
              <Button className="btn-org text-[12px] md:text-[14px]!">
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
