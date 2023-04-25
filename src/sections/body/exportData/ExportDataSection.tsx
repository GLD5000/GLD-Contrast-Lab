import { useColourInputContext } from '../../../contexts/ColourInputProvider';
import TextUl from '../../../elements/TextUl';
import NoData from '../NoData';
import InfoTable from './InfoTable';

const listStrings = [
  'See the Relative Luminance of each colour and find its Contrast Ratio against white or black.',
  `Use 'View...' to choose the data on screen or 'Copy...' to export to a text editor or spreadsheet.`,
];

export default function ExportDataSection() {
  const { colourMap } = useColourInputContext();

  return (
    <section id="Export-Data" className="grid min-h-[75vh] scroll-my-24 gap-4">
      <div className="mr-auto grid place-items-start">
        <h2 className=" m-0 text-2xl font-bold">Export</h2>
        <p className="mt-2 mb-8 text-lg">View and Export</p>
        <TextUl textArray={listStrings} />
      </div>
      {!colourMap || colourMap.size === 0 ? (
        <NoData />
      ) : (
        <div className="relative grid w-full overflow-x-auto">
          <InfoTable />
        </div>
      )}
    </section>
  );
}
