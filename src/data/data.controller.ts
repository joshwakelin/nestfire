import { Controller, Get, Post, Delete, Param, Body, NotFoundException, Query } from '@nestjs/common';
import { Firestore } from '../firestore.service'; // Replace with your actual Firestore import

@Controller('data')
export class DataController {

  @Get(':collection')
  async findAll(@Param('collection') collection: string): Promise<any> {
    try {
      const snapshot = await Firestore.collection(collection).get();
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching data from Firestore');
    }
  }

  @Get(':collection/:id')
  async findOne(@Param('collection') collection: string, @Param('id') id: string): Promise<any> {
    try {
      const doc = await Firestore.collection(collection).doc(id).get();
      if (!doc.exists) {
        throw new NotFoundException('Document not found');
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching data from Firestore');
    }
  }

  @Post(':collection/:id')
  async create(@Param('collection') collection: string, @Param('id') id: string, @Body() data: any): Promise<any> {
    try {
      await Firestore.collection(collection).doc(id).set(data);
            const docSnapshot = await Firestore.collection(collection).doc(id).get();
      const responseData = {
        id: docSnapshot.id,
        ...docSnapshot.data()
      };

      return responseData;
    } catch (error) {
      console.error(error);
      throw new Error('Error creating document in Firestore');
    }
  }

  @Delete(':collection/:id')
  async remove(@Param('collection') collection: string, @Param('id') id: string): Promise<any> {
    try {
      const docRef = Firestore.collection(collection).doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new NotFoundException('Document not found');
      }
      await docRef.delete();
      return {
        id: id,
        message: 'Document successfully deleted'
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error deleting document from Firestore');
    }
  }

  @Get(':collection/query')
  async findByQuery(
    @Param('collection') collection: string,
    @Query('field') field: string,
    @Query('operator') operator: string,
    @Query('value') value: string
  ): Promise<any> {
    try {
      let query: FirebaseFirestore.Query;

      switch (operator) {
        case '==':
          query = Firestore.collection(collection).where(field, '==', value);
          break;
        case '>=':
          query = Firestore.collection(collection).where(field, '>=', parseFloat(value));
          break;
        case '>':
          query = Firestore.collection(collection).where(field, '>', parseFloat(value));
          break;
        case '<':
          query = Firestore.collection(collection).where(field, '<', parseFloat(value));
          break;
        default:
          throw new Error('Invalid operator');
      }

      const snapshot = await query.get();
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Error querying data from Firestore');
    }
  }

  @Get(':collection/range')
  async getDataInRange(
    @Param('collection') collection: string,
    @Query('field') field: string,
    @Query('operator') operator: string, // Make sure operator type is properly defined
    @Query('value') value: any
  ): Promise<any[]> {
    try {
      const snapshot = await Firestore.collection(collection).where(field, operator as FirebaseFirestore.WhereFilterOp, value).get();
      const data = snapshot.docs.map(doc => doc.data());
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Error querying data in range from Firestore');
    }
  }
}
