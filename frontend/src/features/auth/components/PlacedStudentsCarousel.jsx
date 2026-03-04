import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";

const placedStudents = [
  {
    tempId: 0,
    testimonial: "Securing a placement at Google was my dream, and CampusOne made it possible with their amazing training.",
    by: "Rahul Sharma, SDE at Google",
    imgSrc: "https://i.pravatar.cc/150?img=11"
  },
  {
    tempId: 1,
    testimonial: "The placement cell helped me refine my technical skills and ace the interviews at Microsoft.",
    by: "Priya Patel, Software Engineer at Microsoft",
    imgSrc: "https://i.pravatar.cc/150?img=5"
  },
  {
    tempId: 2,
    testimonial: "I am grateful for the constant support from my mentors who guided me to land a role at Amazon.",
    by: "Amit Verma, Cloud Architect at AWS",
    imgSrc: "https://i.pravatar.cc/150?img=12"
  },
  {
    tempId: 3,
    testimonial: "CampusOne's ERP system made tracking my placement progress so simple and efficient.",
    by: "Sneha Reddy, Data Analyst at Meta",
    imgSrc: "https://i.pravatar.cc/150?img=9"
  },
  {
    tempId: 4,
    testimonial: "Landing a job at Adobe through campus placements was a turning point in my career.",
    by: "Vikram Singh, UX Designer at Adobe",
    imgSrc: "https://i.pravatar.cc/150?img=13"
  }
];

const TestimonialCard = ({ position, student, handleMove, cardSize }) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 rounded-xl",
        isCenter
          ? "z-10 bg-primary text-white border-primary shadow-xl"
          : "z-0 bg-white/10 backdrop-blur-md text-text-main border-border-custom opacity-40 scale-90"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
      }}
    >
      <img
        src={student.imgSrc}
        alt={student.by}
        className="mb-4 h-16 w-16 rounded-full object-cover border-2 border-white/20"
      />

      <h3 className="text-md font-semibold leading-tight">
        "{student.testimonial}"
      </h3>

      <p className="absolute bottom-8 left-8 right-8 text-sm font-medium opacity-80">
        — {student.by}
      </p>
    </div>
  );
};

export default function PlacedStudentsCarousel() {
  const [cardSize, setCardSize] = useState(365);
  const [studentsList, setStudentsList] = useState(placedStudents);

  const handleMove = (steps) => {
    const newList = [...studentsList];

    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }

    setStudentsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 300 : 240);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      handleMove(1);
    }, 4000);

    return () => clearInterval(interval);
  }, [studentsList]);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-transparent">
      <div className="relative w-full h-[500px]">
        {studentsList.map((student, index) => {
          const position =
            studentsList.length % 2
              ? index - (studentsList.length - 1) / 2
              : index - studentsList.length / 2;

          return (
            <TestimonialCard
              key={student.tempId}
              student={student}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}
      </div>

      <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-4">
        <button
          onClick={() => handleMove(-1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border-custom bg-white/10 backdrop-blur-md text-text-main hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer shadow-lg"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={() => handleMove(1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border-custom bg-white/10 backdrop-blur-md text-text-main hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer shadow-lg"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
