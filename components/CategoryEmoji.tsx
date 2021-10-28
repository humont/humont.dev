interface Props {
  category: string;
}

export const CategoryEmoji = ({ category }: Props) => {
  return (
    <>
      {category === 'Dev'
        ? ' 🔧'
        : category === 'Thoughts'
        ? ' 🧠'
        : category === 'Blockchain'
        ? ' 🌐'
        : category === 'Databases'
        ? ' 💾'
        : category === 'Exercise'
        ? '🏋️‍♀️'
        : category === 'Project'
        ? '🗂'
        : ''}
    </>
  );
};
