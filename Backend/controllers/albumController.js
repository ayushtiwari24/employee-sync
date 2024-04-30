// const axios = require("axios");
// const Album = require("../models/Album");
// const logger = require("../utils/logger");

// const saveRecords = async () => {
//   let newCount = 0;
//   let existingCount = 0;
//   let updatedCount = 0;
//   let errorCount = 0;
//   let updatedRecords = []; // Store updated records
//   let errors = []; // Store error messages

//   for (let albumNumber = 1; albumNumber <= 100; albumNumber++) {
//     try {
//       const response = await axios.get(
//         `https://jsonplaceholder.typicode.com/albums/${albumNumber}/photos`
//       );
//       const records = response.data;

//       for (const record of records) {
//         try {
//           // Simulate an error by creating records with missing required fields
//           // Here, we remove the 'id' field from the record intentionally
//           const { id, ...recordWithoutId } = record;

//           if (
//             !recordWithoutId.id ||
//             !recordWithoutId.title ||
//             !recordWithoutId.url
//           ) {
//             throw new Error("Invalid record: Missing required fields");
//           }
//           const existingRecord = await Album.findOne({ id: record.id });
//           if (!existingRecord) {
//             await Album.create(record);
//             newCount++;
//           } else {
//             const updatedFields = {};
//             // Check if any fields are different and update them
//             for (const [key, value] of Object.entries(record)) {
//               if (existingRecord[key] !== value) {
//                 updatedFields[key] = value;
//               }
//             }
//             if (Object.keys(updatedFields).length > 0) {
//               const updatedRecord = await Album.findOneAndUpdate(
//                 { id: record.id },
//                 { $set: updatedFields },
//                 { new: true }
//               );
//               updatedRecords.push({ record: updatedRecord, updatedFields });
//               updatedCount++;
//             } else {
//               existingCount++;
//             }
//           }
//         } catch (err) {
//           errorCount++;
//           errors.push(err.message); // Store error message
//           logger.error(
//             `Error saving record: ${JSON.stringify(record)}, Error: ${
//               err.message
//             }`
//           );
//         }
//       }
//     } catch (err) {
//       errorCount++;
//       errors.push(err.message); // Store error message
//       logger.error(
//         `Error fetching records from API for album ${albumNumber}: ${err.message}`
//       );
//     }
//   }

//   console.log(`New Records Added: ${newCount}`);
//   console.log(`Existing Records: ${existingCount}`);
//   console.log(`Updated Records: ${updatedCount}`);
//   console.log(`Errors Encountered: ${errorCount}`);

//   return {
//     newCount,
//     existingCount,
//     updatedCount,
//     errorCount,
//     updatedRecords,
//     errors,
//   };
// };

// module.exports = {
//   saveRecords,
// };

/////////////////////////////////////////////////////////////////////////

// const axios = require("axios");
// const Album = require("../models/Album");
// const logger = require("../utils/logger");

// const saveRecords = async (ws) => {
//   let totalNewCount = 0;
//   let totalExistingCount = 0;
//   let totalUpdatedCount = 0;
//   let totalErrorCount = 0;
//   let totalUpdatedRecords = [];
//   let totalErrors = [];

//   let albumNumber = 1;
//   let hasNextPage = true;

//   while (hasNextPage) {
//     let newCount = 0;
//     let existingCount = 0;
//     let updatedCount = 0;
//     let errorCount = 0;
//     let updatedRecords = [];
//     let errors = [];

//     try {
//       const response = await axios.get(
//         `https://jsonplaceholder.typicode.com/albums/${albumNumber}/photos`
//       );
//       const records = response.data;

//       if (records.length === 0) {
//         hasNextPage = false;
//         break;
//       }

//       for (const record of records) {
//         try {
//           const { id, ...recordWithoutId } = record;

//           if (
//             !recordWithoutId.id ||
//             !recordWithoutId.title ||
//             !recordWithoutId.url
//           ) {
//             throw new Error("Invalid record: Missing required fields");
//           }

//           const existingRecord = await Album.findOne({ id: record.id });
//           if (!existingRecord) {
//             await Album.create(recordWithoutId);
//             newCount++;
//           } else {
//             const updatedFields = {};
//             for (const [key, value] of Object.entries(recordWithoutId)) {
//               if (existingRecord[key] !== value) {
//                 updatedFields[key] = value;
//               }
//             }
//             if (Object.keys(updatedFields).length > 0) {
//               const updatedRecord = await Album.findOneAndUpdate(
//                 { id: record.id },
//                 { $set: updatedFields },
//                 { new: true }
//               );
//               updatedRecords.push({ record: updatedRecord, updatedFields });
//               updatedCount++;
//             } else {
//               existingCount++;
//             }
//           }
//         } catch (err) {
//           errorCount++;
//           errors.push(err.message);
//           logger.error(
//             `Error saving record: ${JSON.stringify(record)}, Error: ${
//               err.message
//             }`
//           );
//         }
//       }
//     } catch (err) {
//       errorCount++;
//       errors.push(err.message);
//       logger.error(
//         `Error fetching records from API for album ${albumNumber}: ${err.message}`
//       );
//     }

//     totalNewCount += newCount;
//     totalExistingCount += existingCount;
//     totalUpdatedCount += updatedCount;
//     totalErrorCount += errorCount;
//     totalUpdatedRecords = totalUpdatedRecords.concat(updatedRecords);
//     totalErrors = totalErrors.concat(errors);

//     ws.send(
//       JSON.stringify({
//         newCount,
//         existingCount,
//         updatedCount,
//         errorCount,
//         updatedRecords,
//         errors,
//       })
//     );

//     albumNumber++;
//   }

//   console.log(`Total New Records Added: ${totalNewCount}`);
//   console.log(`Total Existing Records: ${totalExistingCount}`);
//   console.log(`Total Updated Records: ${totalUpdatedCount}`);
//   console.log(`Total Errors Encountered: ${totalErrorCount}`);

//   return {
//     totalNewCount,
//     totalExistingCount,
//     totalUpdatedCount,
//     totalErrorCount,
//     totalUpdatedRecords,
//     totalErrors,
//   };
// };

// module.exports = {
//   saveRecords,
// };

///////////////////////////////////////////////////////

const axios = require("axios");
const Album = require("../models/Album");
const logger = require("../utils/logger");

const saveRecords = async (ws) => {
  let totalNewCount = 0;
  let totalExistingCount = 0;
  let totalUpdatedCount = 0;
  let totalErrorCount = 0;
  let totalUpdatedRecords = [];
  let totalErrors = [];

  let albumNumber = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    let newCount = 0;
    let existingCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    let updatedRecords = [];
    let errors = [];

    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/albums/${albumNumber}/photos`
      );
      const records = response.data;

      if (records.length === 0) {
        hasNextPage = false;
        break;
      }

      for (const record of records) {
        try {
          // if (!isValidRecord(record)) {
          //   throw new Error("Invalid record: Missing required fields");
          // }

          const existingRecord = await Album.findOne({ id: record.id });
          if (!existingRecord) {
            await Album.create(record);
            newCount++;
          } else {
            const updatedFields = {};
            for (const [key, value] of Object.entries(record)) {
              if (existingRecord[key] !== value) {
                updatedFields[key] = value;
              }
            }
            if (Object.keys(updatedFields).length > 0) {
              const updatedRecord = await Album.findOneAndUpdate(
                { id: record.id },
                { $set: updatedFields },
                { new: true }
              );
              updatedRecords.push({ record: updatedRecord, updatedFields });
              updatedCount++;
            } else {
              existingCount++;
            }
          }
        } catch (err) {
          errorCount++;
          errors.push(err.message);
          logger.error(
            `Error saving record: ${JSON.stringify(record)}, Error: ${
              err.message
            }`
          );
        }
      }
    } catch (err) {
      errorCount++;
      errors.push(err.message);
      logger.error(
        `Error fetching records from API for album ${albumNumber}: ${err.message}`
      );
    }

    totalNewCount += newCount;
    totalExistingCount += existingCount;
    totalUpdatedCount += updatedCount;
    totalErrorCount += errorCount;
    totalUpdatedRecords = totalUpdatedRecords.concat(updatedRecords);
    totalErrors = totalErrors.concat(errors);

    ws.send(
      JSON.stringify({
        newCount,
        existingCount,
        updatedCount,
        errorCount,
        updatedRecords,
        errors,
      })
    );

    albumNumber++;
  }

  logger.info(`Total New Records Added: ${totalNewCount}`);
  logger.info(`Total Existing Records: ${totalExistingCount}`);
  logger.info(`Total Updated Records: ${totalUpdatedCount}`);
  logger.info(`Total Errors Encountered: ${totalErrorCount}`);

  return {
    totalNewCount,
    totalExistingCount,
    totalUpdatedCount,
    totalErrorCount,
    totalUpdatedRecords,
    totalErrors,
  };
};

module.exports = {
  saveRecords,
};
