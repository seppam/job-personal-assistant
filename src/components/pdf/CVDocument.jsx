import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register Roboto Mono for ATS compliance & Terminal aesthetic
Font.register({
  family: 'Roboto Mono',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', // Fallback to Roboto Light if Mono link is missing or use a robust source
});

// Accurate styles for professional output
const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff', color: '#111' },
  section: { marginBottom: 15 },
  header: { marginBottom: 20, borderBottom: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold' },
  contact: { fontSize: 9, color: '#555', marginTop: 4 },
  title: { fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, borderBottom: 0.5, borderBottomColor: '#ccc', paddingBottom: 2 },
  jobTitle: { fontSize: 11, fontWeight: 'bold' },
  company: { fontSize: 11, color: '#333' },
  date: { fontSize: 9, color: '#777' },
  bullet: { fontSize: 10, color: '#333', marginTop: 3, lineHeight: 1.4 },
});

// Tech Theme (Roboto Mono)
const techStyles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Courier' }, // Fallback to Courier for Mono-vibes in PDF, or use registered Font
  header: { marginBottom: 20, borderLeft: 5, borderLeftColor: '#bdc2ff', paddingLeft: 12 },
  name: { fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' },
  title: { fontSize: 11, fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: 3, marginBottom: 8 },
  bullet: { fontSize: 9, fontFamily: 'Courier', marginTop: 2, lineHeight: 1.3 },
});

const CVDocument = ({ data, theme = 'tech' }) => {
  const currentStyles = theme === 'tech' ? techStyles : styles;

  return (
    <Document>
      <Page size="A4" style={currentStyles.page}>
        <View style={currentStyles.header}>
          <Text style={currentStyles.name}>{data.personal.name || 'YOUR NAME'}</Text>
          <Text style={currentStyles.contact}>
            {data.personal.email} • {data.personal.phone} • {data.personal.location}
          </Text>
        </View>

        {data.personal.summary && (
          <View style={currentStyles.section}>
            <Text style={currentStyles.title}>Professional Signal</Text>
            <Text style={currentStyles.bullet}>{data.personal.summary}</Text>
          </View>
        )}

        {data.experience.length > 0 && (
          <View style={currentStyles.section}>
            <Text style={currentStyles.title}>Trajectory</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={currentStyles.jobTitle}>{exp.role} @ {exp.company}</Text>
                  <Text style={currentStyles.date}>{exp.dates}</Text>
                </View>
                <Text style={currentStyles.bullet}>{exp.bullets}</Text>
              </View>
            ))}
          </View>
        )}

        {data.skills.length > 0 && (
          <View style={currentStyles.section}>
            <Text style={currentStyles.title}>Technical Arsenal</Text>
            <Text style={currentStyles.bullet}>{data.skills.join(' • ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CVDocument;
