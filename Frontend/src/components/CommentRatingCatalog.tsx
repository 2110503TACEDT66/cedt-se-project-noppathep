"use client"
import { useState } from 'react';
import { Rating } from "@mui/material";

const CommentRatingCatalog = ({ ratingJson }: { ratingJson: any }) => {
    const [visibleComments, setVisibleComments] = useState(10); // Number of comments initially visible

    const handleLoadMore = () => {
        setVisibleComments(prevVisibleComments => prevVisibleComments + 10);
    };

    return (
        <div className="w-full flex flex-col gap-3 justify-center items-center mt-5">
            <div className="text-xl font-bold">
                What others say
            </div>
            {ratingJson.data.slice(0, visibleComments).map((item: any) => (
                <div key={item._id} className="w-full sm:w-[500px] px-4 py-2 text-left bg-slate-200 rounded-lg text-black">
                    <div className="">
                        <strong>User</strong> {item.user}
                    </div>
                    <Rating value={item.rating} readOnly></Rating>
                    <div className="bg-slate-300 rounded-md p-2">
                        {item.comment}
                    </div>
                </div>
            ))}
            {ratingJson.data.length > visibleComments && (
                <button onClick={handleLoadMore} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4">
                    Load More
                </button>
            )}
        </div>
    );
};

export default CommentRatingCatalog;
