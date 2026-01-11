const FinishedSummary = () => {
  return (
    <div className="grid w-[962px] grid-cols-[max-content_1fr] gap-x-[15px] gap-y-[8px] py-[15px]">
      {/* Row 1: Total Finished */}
      <div className="grid w-fit grid-flow-col text-[16px] font-semibold leading-[19px] text-black">
        <span className="">
          Total : Rp59.150.000 | Total Biaya Admin : Rp43.500.000
        </span>
      </div>
    </div>
  );
};

export default FinishedSummary;
